-- =======================================================
-- SUPERVISED DATABASE SCHEMA FOR SUPABASE WITH IP-LIMITS & BANS
-- =======================================================

-- 1. Create IP Bans Table
CREATE TABLE IF NOT EXISTS public.ip_bans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT UNIQUE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL NOT NULL
);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================

ALTER TABLE public.ip_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- IP Bans Policies
CREATE POLICY "Admins can view IP bans" 
ON public.ip_bans FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage IP bans" 
ON public.ip_bans FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Products Policies
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Sellers can insert products" 
ON public.products FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('seller', 'admin')));

CREATE POLICY "Sellers can update their own products" 
ON public.products FOR UPDATE 
USING (seller_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Orders Policies
CREATE POLICY "Orders are viewable by owner or admin" 
ON public.orders FOR SELECT 
USING (auth.uid() = customer_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Customers can insert their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Order Items Policies
CREATE POLICY "Order items viewable by order owner or admin" 
ON public.order_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE id = order_id AND (customer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
));

-- =======================================================
-- TRIGGERS & FUNCTIONS FOR IP ENFORCEMENT & SIGNUP
-- =======================================================

-- Function to handle automated profile setup on Supabase auth.users INSERT
-- Checks both IP Bans and enforces account limit of max 2 accounts per IP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_ip TEXT;
  ip_count INTEGER;
  is_banned BOOLEAN;
BEGIN
  -- Extract ip_address from user metadata passed during signUp options
  user_ip := NEW.raw_user_meta_data->>'ip_address';

  -- Enforce IP checks if IP is provided
  IF user_ip IS NOT NULL THEN
    -- 1. Check if IP address is banned
    SELECT EXISTS(SELECT 1 FROM public.ip_bans WHERE ip_address = user_ip) INTO is_banned;
    IF is_banned THEN
      RAISE EXCEPTION 'Access Denied: This IP address is banned.';
    END IF;

    -- 2. Check if the IP has reached the limit of 2 accounts
    SELECT COUNT(*) INTO ip_count
    FROM public.profiles
    WHERE ip_address = user_ip;

    IF ip_count >= 2 THEN
      RAISE EXCEPTION 'Registration Limit Exceeded: You cannot create more than two accounts from the same IP address.';
    END IF;
  END IF;

  -- Create corresponding public profile
  INSERT INTO public.profiles (id, email, role, ip_address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    user_ip
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute before a new auth user is created in Supabase Auth
-- Drops existing triggers if they exist to allow clean redeploy
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
