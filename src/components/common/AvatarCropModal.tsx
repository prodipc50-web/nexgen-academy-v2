import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  Camera,
  Image as ImageIcon,
  Move
} from 'lucide-react';

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  userName: string;
  onSaveAvatar: (croppedDataUrl: string) => void;
  title?: string;
}

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  userName,
  onSaveAvatar,
  title = 'Adjust & Crop Profile Picture'
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (currentAvatar) {
        setImageSrc(currentAvatar);
      } else {
        setImageSrc(null);
      }
      setZoom(1);
      setRotation(0);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [isOpen, currentAvatar]);

  // Load image whenever imageSrc changes
  useEffect(() => {
    if (!imageSrc) {
      imageObjRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageObjRef.current = img;
      renderPreview();
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Re-render canvas on state change
  useEffect(() => {
    renderPreview();
  }, [zoom, rotation, panOffset]);

  const renderPreview = () => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 320;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Background fill
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.translate(size / 2 + panOffset.x, size / 2 + panOffset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Maintain aspect ratio
    const imgAspect = img.width / img.height;
    let drawW = size;
    let drawH = size;
    if (imgAspect > 1) {
      drawH = size;
      drawW = size * imgAspect;
    } else {
      drawW = size;
      drawH = size / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImageSrc(reader.result as string);
        setZoom(1);
        setRotation(0);
        setPanOffset({ x: 0, y: 0 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObjRef.current) return;

    // Create high-res circular/square cropped canvas output (256x256)
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 256;
    exportCanvas.height = 256;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Draw circular clip
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const scaleFactor = 256 / 320;
    ctx.save();
    ctx.translate(128 + panOffset.x * scaleFactor, 128 + panOffset.y * scaleFactor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    const img = imageObjRef.current;
    const imgAspect = img.width / img.height;
    let drawW = 320;
    let drawH = 320;
    if (imgAspect > 1) {
      drawH = 320;
      drawW = 320 * imgAspect;
    } else {
      drawW = 320;
      drawH = 320 / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const finalDataUrl = exportCanvas.toDataURL('image/png', 0.95);
    onSaveAvatar(finalDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{title}</h3>
              <p className="text-xs text-slate-500">Profile photo for {userName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload & Selector Bar */}
        <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-xs inline-flex items-center space-x-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Photo (ছবি নির্বাচন)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            Drag to pan • Slider to zoom
          </span>
        </div>

        {/* Canvas / Crop Area */}
        <div className="relative flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl overflow-hidden select-none">
          {/* Guide Message */}
          <div className="absolute top-2 left-2 z-10 flex items-center space-x-1 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-medium">
            <Move className="w-3 h-3 text-indigo-400" />
            <span>Click & Drag to Adjust Position</span>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full cursor-grab active:cursor-grabbing border-4 border-white/80 shadow-2xl bg-slate-800 object-cover"
          />

          {/* Fallback if no image */}
          {!imageSrc && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-2">
              <ImageIcon className="w-12 h-12 text-slate-500 opacity-60" />
              <p className="text-xs font-semibold">No photo selected yet</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-indigo-400 underline font-bold"
              >
                Click here to upload from your PC
              </button>
            </div>
          )}
        </div>

        {/* Crop Controls & Sliders */}
        {imageSrc && (
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            {/* Zoom Slider */}
            <div className="flex items-center space-x-3">
              <span className="font-bold text-slate-700 w-14 shrink-0 flex items-center space-x-1">
                <ZoomIn className="w-3.5 h-3.5 text-indigo-600" />
                <span>Zoom</span>
              </span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="font-mono text-slate-500 w-10 text-right text-[11px] font-bold">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotation & Reset Buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Rotate 90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  Reset Position
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                Output: 256×256 Circular Crop
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!imageSrc}
            onClick={handleApplyCrop}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Save & Apply Photo (ছবি সেভ করুন)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
