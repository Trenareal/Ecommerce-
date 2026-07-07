import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Send, HelpCircle, MessageSquare, PhoneCall, ShieldAlert, CheckCircle2, User, Sparkles, SendHorizontal } from 'lucide-react';

interface QuickReply {
  question: string;
  answer: string;
}

const AGRI_FAQ: QuickReply[] = [
  {
    question: "How does the Julia Agro Escrow system work?",
    answer: "Our escrow system holds your payment securely until you receive and verify the agricultural product's quality. Only when you confirm receipt or within 48 hours of logistics delivery, is the payout released to the farmer/seller."
  },
  {
    question: "Do you offer international export clearing?",
    answer: "Yes, we handle NAFDAC clearances, phytosanitary certifications, custom duty documentation, and direct ocean/air freight forwarding to the US, EU, and UK."
  },
  {
    question: "How do I lodge a quality mismatch dispute?",
    answer: "Go to the 'File Dispute' tab in this drawer, fill out the product mismatch form, and submit. Our certified agricultural arbiters will contact you within 2 hours to coordinate a physical inspection."
  },
  {
    question: "What is the delivery time for bulk grains?",
    answer: "Within Nigeria, bulk cargo (5 to 30 tonnes) takes 2-4 working days. International logistics ranges from 5 days (air freight) to 21 days (ocean shipping)."
  }
];

export const CustomerCareDrawer: React.FC = () => {
  const {
    isCustomerCareOpen,
    setIsCustomerCareOpen,
    setIsCustomerAuthOpen,
    currentUser,
    showToast
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'dispute' | 'contact'>('chat');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello there! Welcome to Julia Agro Customer Care. How can we support your agricultural trade today? You can also connect with us directly on WhatsApp at +234 803 300 1234 for instant updates!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  


  // Dispute Form
  const [disputeType, setDisputeType] = useState('Quality Mismatch');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [disputeProduct, setDisputeProduct] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isCustomerCareOpen) return null;

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Simulated chatbot response lookup or fallback
    setTimeout(() => {
      let botResponse = "Thank you for writing to us. One of our certified Julia Agro Support specialists is reviewing your trade ticket. You will receive an SMS alert shortly.";
      
      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes('escrow') || lowerText.includes('pay') || lowerText.includes('secure')) {
        botResponse = "Your payments are held securely in the Julia Agro Escrow lockbox. Funds are only transferred after physical inspection at your warehouse.";
      } else if (lowerText.includes('export') || lowerText.includes('shipping') || lowerText.includes('abroad')) {
        botResponse = "We clear customs, phytosanitary checks, and handle global haulage. Standard ocean freight to ports takes 14-21 business days.";
      } else if (lowerText.includes('dispute') || lowerText.includes('damage') || lowerText.includes('refund')) {
        botResponse = "I'm sorry to hear about the issue. Please switch to the 'File Escrow Dispute' tab at the top of this drawer to log a high-priority trade investigation ticket.";
      } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        botResponse = "Hi! How can our agro-consultants help you today? Ask us about shipping times, product certifications, or escrow policies.";
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  const handleQuickReplyClick = (faq: QuickReply) => {
    handleSendMessage(faq.question);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeDesc.trim() || !disputeProduct.trim()) {
      showToast('Please specify the product and describe the issue.', 'warning');
      return;
    }
    setDisputeSubmitted(true);
    showToast('Your agricultural escrow dispute has been registered successfully.', 'success');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200 animate-slide-in">
      
      {/* Header */}
      <div className="bg-[#141414] text-white p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-[#16A34A] flex items-center justify-center text-white font-extrabold text-sm">
            Care
          </div>
          <div>
            <h3 className="font-extrabold text-xs tracking-wider uppercase">JULIA AGRO HELPDESK</h3>
            <p className="text-[10px] text-gray-400">Escrow & Quality Escrow Logistics</p>
          </div>
        </div>
        <button
          onClick={() => setIsCustomerCareOpen(false)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-gray-200 text-center text-xs font-bold bg-gray-50 shrink-0">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`py-3 border-b-2 cursor-pointer transition-all ${
            activeSubTab === 'chat' 
              ? 'border-[#16A34A] text-[#16A34A] bg-white' 
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          💬 Ask Julia Bot
        </button>
        <button
          onClick={() => setActiveSubTab('dispute')}
          className={`py-3 border-b-2 cursor-pointer transition-all ${
            activeSubTab === 'dispute' 
              ? 'border-[#16A34A] text-[#16A34A] bg-white' 
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          ⚠️ Escrow Dispute
        </button>
        <button
          onClick={() => setActiveSubTab('contact')}
          className={`py-3 border-b-2 cursor-pointer transition-all ${
            activeSubTab === 'contact' 
              ? 'border-[#16A34A] text-[#16A34A] bg-white' 
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          📞 Hotline Details
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        
        {/* Guard for login requirements */}
        {!currentUser ? (
          <div className="my-auto py-8 text-center space-y-6 max-w-sm mx-auto">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-[#16A34A]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-gray-900 uppercase">Customer Sign In Required</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                To access live-chat, trace export cargo bills, or coordinate physical quality disputes under fair-trade escrow, please sign in.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsCustomerCareOpen(false);
                  setIsCustomerAuthOpen(true);
                }}
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold uppercase py-3 rounded shadow-md transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
              >
                <span>Customer Log In / Sign Up</span>
              </button>
              <p className="text-[10px] text-gray-400">
                You must sign in as a customer to access customer care. Administrators cannot log into Customer Care using admin credentials.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ACTIVE CHATBOT SUB-TAB */}
            {activeSubTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between space-y-4">
                
                {/* Scrollable messages block */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex flex-col max-w-[85%] ${
                        m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className="text-[9px] text-gray-400 font-semibold mb-0.5 px-1">{m.sender === 'bot' ? 'Julia Assistant' : 'You'}</div>
                      <div
                        className={`rounded-lg px-3 py-2 leading-relaxed ${
                          m.sender === 'user'
                            ? 'bg-[#16A34A] text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[8px] text-gray-400 font-mono mt-0.5 px-1">{m.time}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick FAQ replies */}
                <div className="space-y-1.5 shrink-0 bg-green-50/40 p-2.5 rounded-lg border border-green-200/40">
                  <p className="text-[10px] text-green-800 font-black flex items-center space-x-1 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Quick Trade FAQs</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {AGRI_FAQ.map((faq, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReplyClick(faq)}
                        className="bg-white hover:bg-green-100 border border-green-200 text-[10px] text-gray-700 px-2 py-1 rounded-md transition-all text-left truncate max-w-full cursor-pointer"
                      >
                        💡 {faq.question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input box */}
                <div className="flex items-center space-x-2 pt-2 shrink-0 border-t border-gray-100">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(inputVal); }}
                    placeholder="Type your message here..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white transition-all"
                  />
                  <button
                    onClick={() => handleSendMessage(inputVal)}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white p-2 rounded-md cursor-pointer transition-colors border-none"
                  >
                    <SendHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ESCROW DISPUTE SUB-TAB */}
            {activeSubTab === 'dispute' && (
              <div className="space-y-4 text-xs">
                {disputeSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-lg text-center space-y-3 py-8">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-extrabold text-sm text-gray-900 uppercase">Trade Dispute Opened</h4>
                    <p className="text-[11px] text-gray-600 leading-normal">
                      Your escrow hold dispute has been received by our Fair-Trade Inspection Board.
                    </p>
                    <div className="text-[10px] bg-white border border-emerald-100 p-3 rounded font-mono text-gray-500 text-left space-y-1">
                      <p>🎫 Ticket: DIS-{(Math.random() * 100000).toFixed(0)}</p>
                      <p>📦 Product: {disputeProduct}</p>
                      <p>⚡ Status: High-Priority Pending Inspection</p>
                    </div>
                    <button
                      onClick={() => {
                        setDisputeSubmitted(false);
                        setDisputeDesc('');
                        setDisputeProduct('');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded border-none cursor-pointer"
                    >
                      Log Another Dispute
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDisputeSubmit} className="space-y-4">
                    <div className="bg-red-50 text-red-800 p-3 rounded border border-red-100 text-[10px] leading-relaxed flex items-start space-x-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Escrow Freeze notice:</strong> Opening a dispute immediately freezes product payout to the farmer/seller until independent quality and crop testing parameters are completed.
                      </span>
                    </div>

                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Select Dispute Reason</label>
                      <select
                        value={disputeType}
                        onChange={e => setDisputeType(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        <option value="Quality Mismatch">🌾 Crop Quality Mismatch (Damaged / Moist / Bad Grain)</option>
                        <option value="Quantity Mismatch">⚖️ Weight Mismatch (Missing bags / tonnes)</option>
                        <option value="Logistics Delays">🚚 Severe Haulage Delays (Late Dispatch)</option>
                        <option value="Certification Issues">📜 Missing Phytosanitary / Customs clearance papers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Associated Product or Order ID</label>
                      <input
                        type="text"
                        required
                        value={disputeProduct}
                        onChange={e => setDisputeProduct(e.target.value)}
                        placeholder="e.g. Yellow Garri 50kg bags or ORD-9124"
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Detailed Case Narrative</label>
                      <textarea
                        rows={5}
                        required
                        value={disputeDesc}
                        onChange={e => setDisputeDesc(e.target.value)}
                        placeholder="State moisture levels, bag counts, or dispatch delays with precision..."
                        className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold uppercase py-2.5 rounded transition-all cursor-pointer border-none text-xs flex items-center justify-center space-x-1"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Lock Funds & Open Dispute</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* HOTLINES SUB-TAB */}
            {activeSubTab === 'contact' && (
              <div className="space-y-4 text-xs">
                {/* WhatsApp Direct Support Card */}
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center space-y-3 shadow-sm">
                  <div className="flex justify-center">
                    <span className="bg-[#25D366] text-white rounded-full p-2.5 shadow-md flex items-center justify-center">
                      <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.004 0C5.374 0 0 5.373 0 12c0 2.112.546 4.164 1.587 5.975L0 24l6.192-1.625A11.936 11.936 0 0 0 12.004 24c6.629 0 12.004-5.374 12.004-12C24.008 5.373 18.633 0 12.004 0zM12 21.993c-1.936 0-3.83-.5-5.503-1.446l-.394-.233-3.673.963.98-3.58-.255-.407c-.99-1.579-1.513-3.414-1.513-5.291 0-5.51 4.484-9.993 9.998-9.993 5.514 0 9.998 4.483 9.998 9.993 0 5.51-4.484 9.993-9.998 9.993zm5.474-7.51c-.3-.15-1.775-.875-2.05-.975s-.475-.15-.675.15c-.2.3-.775.975-.95 1.175s-.35.225-.65.075c-.3-.15-1.267-.467-2.413-1.49-.893-.797-1.496-1.78-1.671-2.08-.175-.3-.02-.462.13-.61.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525c-.075-.15-.675-1.625-.925-2.225-.244-.588-.493-.508-.675-.518l-.575-.01c-.2 0-.525.075-.8 0.375s-1.05 1.025-1.05 2.5 1.075 2.9 1.225 3.1c.15.2 2.115 3.23 5.125 4.53.716.31 1.275.495 1.71.635.72.23 1.375.195 1.892.12.577-.085 1.775-.725 2.025-1.39.25-.665.25-1.235.175-1.35s-.275-.2-.575-.35z"/>
                      </svg>
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-wide">WhatsApp Support Link</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                      Skip call queues! Connect directly with our certified agricultural officers and escrow agents via WhatsApp.
                    </p>
                  </div>
                  <a 
                    href="https://wa.me/2348033001234?text=Hello%20Julia%20Agro%20Support%2C%20I%20need%20help%20with%20my%20agricultural%20trade."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs uppercase py-2.5 px-6 rounded-md transition-all shadow-md cursor-pointer border-none w-full"
                  >
                    <span>💬 Chat on WhatsApp</span>
                  </a>
                  <p className="text-[10px] text-gray-400 font-mono">Available 24/7 &bull; +234 803 300 1234</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3">
                  <h4 className="font-extrabold text-[#16A34A] flex items-center space-x-1">
                    <PhoneCall className="w-4 h-4" />
                    <span>NIGERIAN & EXPORT LOGISTICS HOTLINES</span>
                  </h4>
                  <p className="text-[10px] text-gray-400">Direct connections with our dispatch escorts, haulage inspectors, and port clearance officers.</p>
                  
                  <div className="space-y-2 pt-2 border-t border-gray-200/60 font-mono">
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                      <div>
                        <p className="font-extrabold text-gray-700 text-[11px]">Headquarters Support Desk</p>
                        <p className="text-[10px] text-gray-400">Lagos, Yaba Area Office</p>
                      </div>
                      <a href="tel:+2348033001234" className="bg-green-50 hover:bg-green-100 text-[#16A34A] font-bold px-2 py-1 rounded border border-green-200/50">
                        📞 +234 803 300 1234
                      </a>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                      <div>
                        <p className="font-extrabold text-gray-700 text-[11px]">Port & Export Logistics Desk</p>
                        <p className="text-[10px] text-gray-400">Apapa Cargo Clearance</p>
                      </div>
                      <a href="tel:+23414409000" className="bg-green-50 hover:bg-green-100 text-[#16A34A] font-bold px-2 py-1 rounded border border-green-200/50">
                        📞 +234 1 440 9000
                      </a>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                      <div>
                        <p className="font-extrabold text-gray-700 text-[11px]">Global Escrow Office</p>
                        <p className="text-[10px] text-gray-400">International Trade Clearance</p>
                      </div>
                      <a href="tel:+18005553000" className="bg-green-50 hover:bg-green-100 text-[#16A34A] font-bold px-2 py-1 rounded border border-green-200/50">
                        📞 +1 800 555 3000
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 text-[10px] leading-relaxed flex items-start space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase">Fair-Trade Escrow Protection Active</p>
                    <p className="mt-0.5">As a buyer, you have the full backing of our multi-signature payment vault. Never pay farmers outside the Jumia Julia Agro Platform to protect your escrow trade safety.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>
      
      {/* Bottom status line */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 text-[9px] text-gray-400 flex justify-between items-center">
        <span>🔒 Secure 256-bit SSL Escrow Encrypted</span>
        <span>Version 1.4.2</span>
      </div>

    </div>
  );
};
