import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, AlertCircle, Sparkles, Upload, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface CameraModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoBase64: string, stockCount: number) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  product,
  isOpen,
  onClose,
  onCapture
}) => {
  const { showToast } = useStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stockCount, setStockCount] = useState<number>(product.stock);
  const [isSimulated, setIsSimulated] = useState(false);
  
  // Agricultural simulated snapshots if camera is unavailable
  const SIMULATED_PHOTOS = [
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600'
  ];

  const [selectedSimIndex, setSelectedSimIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setCameraError(null);
      setStockCount(product.stock);
      setIsSimulated(false);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, product]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsCameraActive(false);
      
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn("Camera init error:", err);
      setCameraError("Could not access camera. This happens if the device lacks a camera, permission was denied, or the app is running inside a secure preview sandbox.");
      setIsSimulated(true); // Default to simulated fallback
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const handleCapture = () => {
    if (isSimulated) {
      // Use chosen simulated agricultural snapshot
      const basePhoto = SIMULATED_PHOTOS[selectedSimIndex];
      setCapturedImage(basePhoto);
      showToast("Verification snapshot simulated successfully!", "success");
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        // Mirror the image if using front camera, otherwise normal
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Add watermark overlay for administrative stock verification
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(10, canvas.height - 40, canvas.width - 20, 30);
        ctx.fillStyle = "#16A34A";
        ctx.font = "bold 12px Courier New";
        const timestamp = new Date().toLocaleString();
        ctx.fillText(`JULIA AGRO AUDIT - ${product.title.toUpperCase()} - STOCK: ${stockCount} - ${timestamp}`, 20, canvas.height - 20);
        
        try {
          const base64 = canvas.toDataURL('image/jpeg');
          setCapturedImage(base64);
          stopCamera();
          showToast("Live stock photo snapped and watermarked!", "success");
        } catch (e) {
          console.error("Canvas export failed:", e);
          setCapturedImage(product.image); // Fallback
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
        showToast("Custom stock picture loaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!capturedImage) return;
    if (isNaN(stockCount) || stockCount < 0) {
      showToast("Please enter a valid stock count.", "warning");
      return;
    }
    onCapture(capturedImage, stockCount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        
        {/* Header */}
        <div className="bg-[#141414] text-white p-4 flex items-center justify-between border-b border-[#16A34A]">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-[#16A34A]" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Stock Photo Audit Center</p>
              <p className="text-[10px] text-gray-400">Verify catalog visual stock & adjust physical inventory counts.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info card */}
        <div className="bg-green-50/50 p-3.5 border-b border-green-100 flex items-start space-x-2 text-xs">
          <div className="bg-[#16A34A] text-white p-1 rounded font-bold shrink-0 text-[10px]">TARGET</div>
          <div>
            <p className="font-bold text-gray-800">{product.title}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Current Recorded Stock: <span className="font-bold font-mono text-gray-700">{product.stock} units</span></p>
          </div>
        </div>

        {/* Video / Camera Capture box */}
        <div className="bg-gray-900 aspect-video relative flex items-center justify-center text-white overflow-hidden">
          
          {capturedImage ? (
            <div className="w-full h-full relative">
              <img 
                src={capturedImage} 
                alt="Captured Snapshot" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Captured Audit Frame</span>
              </div>
            </div>
          ) : (
            <>
              {isCameraActive && !isSimulated ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center max-w-sm space-y-4">
                  {cameraError ? (
                    <div className="space-y-3.5">
                      <div className="w-12 h-12 bg-gray-800 text-[#16A34A] rounded-full flex items-center justify-center mx-auto shadow-md">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#16A34A]">Physical Camera Unavailable</p>
                        <p className="text-[10px] text-gray-400 leading-normal">{cameraError}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-pulse flex flex-col items-center">
                      <RefreshCw className="w-8 h-8 text-green-500 animate-spin-slow mb-2" />
                      <p className="text-xs font-bold">Connecting camera feed...</p>
                    </div>
                  )}

                  {/* Mode Selector */}
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2.5">Audit Media Methods</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsSimulated(true);
                          stopCamera();
                        }}
                        className={`py-2 px-3 rounded font-black cursor-pointer border ${
                          isSimulated 
                            ? 'bg-green-600 border-[#16A34A] text-white shadow-md' 
                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        🌾 Simulated Auditor
                      </button>
                      <label className="bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded font-black cursor-pointer flex items-center justify-center space-x-1">
                        <Upload className="w-3.5 h-3.5 text-green-500" />
                        <span>Upload File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Simulated Mode Gallery */}
          {isSimulated && !capturedImage && (
            <div className="absolute inset-x-0 bottom-0 bg-black/70 p-3 flex flex-col text-xs z-10 border-t border-gray-800">
              <p className="text-[10px] text-[#16A34A] font-black uppercase mb-2 tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                <span>Simulated High-Yield Stock Captures</span>
              </p>
              <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin">
                {SIMULATED_PHOTOS.map((ph, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSimIndex(idx)}
                    className={`relative shrink-0 w-16 h-12 rounded overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedSimIndex === idx ? 'border-[#16A34A] scale-105 shadow' : 'border-transparent opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img src={ph} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controller Block */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs space-y-4">
          
          {/* Stock adjustment input */}
          <div className="bg-white p-3 rounded border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-[#16A34A]" />
              <div>
                <label className="font-bold text-gray-700 block">Verified Physical Stock Count</label>
                <p className="text-[10px] text-gray-400">Match counts to photo evidence.</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                type="button" 
                onClick={() => setStockCount(prev => Math.max(0, prev - 1))}
                className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center font-black bg-gray-100 hover:bg-gray-200 font-mono text-sm cursor-pointer select-none"
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={stockCount}
                onChange={e => setStockCount(parseInt(e.target.value) || 0)}
                className="w-14 text-center font-bold font-mono bg-white border border-gray-200 h-7 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button 
                type="button" 
                onClick={() => setStockCount(prev => prev + 1)}
                className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center font-black bg-gray-100 hover:bg-gray-200 font-mono text-sm cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Snapshot trigger or actions */}
          <div className="flex justify-between items-center pt-1.5">
            {!capturedImage ? (
              <>
                {!isSimulated && cameraError === null ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSimulated(true);
                      stopCamera();
                    }}
                    className="text-gray-500 font-bold hover:text-gray-800 transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>Use Mock Auditor</span>
                  </button>
                ) : isSimulated && cameraError === null ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="text-gray-500 font-bold hover:text-[#16A34A] transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>Enable Live Cam</span>
                  </button>
                ) : (
                  <span className="text-gray-400 text-[10px]">Photo audits secure and logged</span>
                )}

                <button
                  type="button"
                  onClick={handleCapture}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-2.5 rounded font-extrabold uppercase tracking-wider flex items-center space-x-2 shadow-md transition-colors cursor-pointer border-none text-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isSimulated ? "Simulate Frame Snap" : "Capture Stock Image"}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setCapturedImage(null);
                    if (!isSimulated) {
                      startCamera();
                    }
                  }}
                  className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded text-xs transition-colors cursor-pointer"
                >
                  Retake Photo
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-5 py-2 rounded text-xs transition-colors cursor-pointer shadow flex items-center space-x-1.5 border-none"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify Stock & Update Image</span>
                </button>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
