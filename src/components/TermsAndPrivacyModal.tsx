import React, { useState } from 'react';
import { X, Shield, FileText, Scale, Eye, Check, AlertCircle } from 'lucide-react';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const TermsAndPrivacyModal: React.FC<TermsAndPrivacyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  // Sync tab if initialTab changes when opening
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="terms-privacy-modal">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-6">
        <div 
          className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-3xl flex flex-col max-h-[85vh] border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-green-700 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Scale className="w-5 h-5 text-green-200" />
              <div>
                <h3 className="text-base font-black uppercase tracking-wider">
                  Julia Agro Legal Center
                </h3>
                <p className="text-[10px] text-green-100 font-medium">
                  Last updated: July 2026 • Platform Terms & Privacy
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white bg-green-900/30 hover:bg-green-950/40 p-1.5 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
              id="close-legal-modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2">
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'terms'
                  ? 'border-[#16A34A] text-[#16A34A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              id="tab-btn-terms"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms & Conditions</span>
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'privacy'
                  ? 'border-[#16A34A] text-[#16A34A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              id="tab-btn-privacy"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
          </div>

          {/* Legal Document Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 text-gray-600 text-xs leading-relaxed space-y-5 bg-white select-text">
            {activeTab === 'terms' ? (
              <div className="space-y-4 font-sans">
                <div className="bg-green-50 border-l-4 border-green-600 p-3.5 rounded text-green-800 text-[11px] mb-4">
                  <p className="font-bold flex items-center mb-1">
                    <Check className="w-4 h-4 mr-1 shrink-0" />
                    Important Notice for Farmers, Suppliers, and Buyers
                  </p>
                  Welcome to Julia Agro-Seller & Customer Hub. Please review our marketplace conditions. By utilizing our digital platform, escrow networks, transport tools, or logging catalogs, you consent to these rules.
                </div>

                <section className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-xs flex items-center space-x-1.5 border-b pb-1">
                    <span className="text-green-600">1.</span>
                    <span>Direct Agricultural Escrow Agreement</span>
                  </h4>
                  <p>
                    All payments handled via Julia Agro undergo a secured escrow buffer. Funds deposited by buyers remain protected and are only released to vendors (Farmers/Suppliers) upon satisfactory logistic verification:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-gray-500">
                    <li>Buyers must inspect received agro-commodities within <strong>24 hours</strong> of arrival.</li>
                    <li>If quality indicators (moisture content, spoilage, pest infestation) deviate from specifications, a dispute must be initiated prior to escrow distribution.</li>
                    <li>In absence of explicit notification within the threshold, funds are released automatically.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-xs flex items-center space-x-1.5 border-b pb-1">
                    <span className="text-green-600">2.</span>
                    <span>Vendor & Producer Representations</span>
                  </h4>
                  <p>
                    Sellers listing goods on Julia Agro-Seller Center represent and warrant that:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-gray-500">
                    <li>The commodities, seeds, fertilizers, and equipment are authentic, legal, and comply with standards of the Standards Organisation of Nigeria (SON) and NAFDAC where applicable.</li>
                    <li>Sellers must provide precise stock figures. False listings, inflated metrics, or bait-and-switch practices will trigger immediate escrow suspension and seller blacklist logs.</li>
                    <li>All live metrics (such as stock quantities, pricing adjustments, flash sales) remain binding until transacted or disabled.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-xs flex items-center space-x-1.5 border-b pb-1">
                    <span className="text-green-600">3.</span>
                    <span>Shipping, Logistics & Risk of Loss</span>
                  </h4>
                  <p>
                    Julia Agro provides ventilated transit channels for fresh produce, roots, and bulk grains.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-gray-500">
                    <li><strong>Shipping Rates:</strong> Fees are automatically computed relative to Nigerian state-wide zones or international coordinates as detailed in our logistics structure.</li>
                    <li><strong>Perishability:</strong> Risk of spoilage due to freight delays is covered under Julia Agro Transit Protection if shipping is fulfilled directly through our cooperative fleet partners.</li>
                    <li><strong>Direct pickup:</strong> When direct farm pickup is agreed, risk transfers immediately upon vehicle loading.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-xs flex items-center space-x-1.5 border-b pb-1">
                    <span className="text-green-600">4.</span>
                    <span>Prohibited Activities</span>
                  </h4>
                  <p>
                    Users are strictly prohibited from bypassing our secure escrow engine, making offline arrangements to circumvent commission/cooperative structures, listing counterfeit chemical formulations, or using bot scrapers to disrupt dynamic listing servers.
                  </p>
                </section>

                <section className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-xs flex items-center space-x-1.5 border-b pb-1">
                    <span className="text-green-600">5.</span>
                    <span>Limitation of Liability</span>
                  </h4>
                  <p>
                    Julia Agro functions as an interactive agricultural marketplace. We are not liable for natural weather disasters, localized crop failure, or transportation blockages caused by municipal road conditions. Maximum platform liability is strictly limited to the value of the disputed transaction held in active escrow.
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                <div className="bg-green-50 border-l-4 border-green-600 p-3.5 rounded text-green-800 text-[11px] mb-4">
                  <p className="font-bold flex items-center mb-1">
                    <Eye className="w-4 h-4 mr-1 shrink-0" />
                    Our Privacy Commitment
                  </p>
                  At Julia Agro, we prioritize protecting personal details, farm locations, banking logistics, and catalog profiles. We are fully compliant with the Nigeria Data Protection Regulation (NDPR).
                </div>

                <section className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-xs flex items-center space-x-1.5 border-b pb-1">
                    <span className="text-green-600">1.</span>
                    <span>Information We Collect</span>
                  </h4>
                  <p>
                    To operate our cooperative marketplace and seller dashboard efficiently, we gather:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-gray-500">
                    <li><strong>Profile Credentials:</strong> Name, physical farm address, GPS coordinates (for harvest pickups), telephone contacts, and email addresses.</li>
                    <li><strong>Transaction Data:</strong> Escrow records, banking payouts, purchase history, and feedback metrics.</li>
                    <li><strong>System & Device telemetry:</strong> IP addresses, browser types, and usage cookies to sustain active login states securely.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-xs flex items-center space-x-1.5 border-b pb-1">
                    <span className="text-green-600">2.</span>
                    <span>How We Protect & Use Your Data</span>
                  </h4>
                  <p>
                    Data is stored in cryptographically secured cloud databases with restricted personnel access controls. We utilize your parameters strictly to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-gray-500">
                    <li>Process incoming orders, compile seller analytics reports, and initiate escrow payout logs.</li>
                    <li>Dispatch shipping updates and coordinate direct logistics handovers between farm cooperatives and logistics hubs.</li>
                    <li>Address customer support inquiries, issue coupon rewards, and verify agricultural photos.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-xs flex items-center space-x-1.5 border-b pb-1">
                    <span className="text-green-600">3.</span>
                    <span>Third-Party Information Sharing</span>
                  </h4>
                  <p>
                    We never sell or rent your personal, agricultural, or demographic details to marketing brokers. We share data strictly with:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1 text-gray-500">
                    <li><strong>Logistics Drivers & Fleet Partners:</strong> Only shipping address, buyer phone number, and weight parameters are shared to facilitate dispatch.</li>
                    <li><strong>Escrow Gateways:</strong> To authorize bank payouts and process digital naira or currency settlements.</li>
                    <li><strong>Regulatory Authorities:</strong> Where legally mandated to comply with statutory audits.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase text-xs flex items-center space-x-1.5 border-b pb-1">
                    <span className="text-green-600">4.</span>
                    <span>Your Rights under NDPR</span>
                  </h4>
                  <p>
                    You have full authority to request access to records of your data, correct any typo/outdated farm locations, or request permanent deletion of your customer profile. Note that active transaction and escrow records are legally subject to administrative retention periods.
                  </p>
                </section>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-200 gap-3">
            <div className="flex items-center space-x-2 text-gray-500">
              <AlertCircle className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-[10px] font-medium leading-tight">
                Review does not require physical signature. Click "Acknowledge" to proceed.
              </span>
            </div>
            <button
              onClick={onClose}
              className="bg-[#16A34A] hover:bg-green-700 text-white font-extrabold text-xs uppercase px-5 py-2 rounded shadow-md transition-all cursor-pointer text-center sm:w-auto w-full active:scale-[0.98] border-none"
              id="acknowledge-legal-btn"
            >
              Acknowledge & Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
