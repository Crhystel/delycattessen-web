import { createPortal } from "react-dom";
import { X } from "lucide-react";

// Full-screen preview of an image: `image` is { url, name } or null.
export default function ImagePreviewOverlay({ image, onClose }) {
  if (!image) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-ink-200"
        >
          <X size={24} />
        </button>
        <p className="text-white text-sm font-medium mb-2">{image.name}</p>
        <img
          src={image.url}
          alt={image.name}
          className="w-full max-h-[75vh] object-contain rounded-lg"
        />
      </div>
    </div>,
    document.body,
  );
}
