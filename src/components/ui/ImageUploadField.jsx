import { Upload } from 'lucide-react'

// Preview + "Subir imagen" button. `fallback` is shown while there is no image;
// `onPreview` (optional) makes the preview open a larger view when tapped.
export default function ImageUploadField({
  image,
  onFile,
  fallback,
  previewClassName = 'w-12 h-12',
  onPreview,
}) {
  const preview = (
    <img
      src={image}
      alt="Vista previa"
      className={`${previewClassName} rounded-lg object-cover border border-ink-100 ${
        onPreview ? 'cursor-zoom-in hover:opacity-80 transition-opacity' : ''
      }`}
    />
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      {image ? (
        onPreview ? (
          <button type="button" onClick={onPreview} className="shrink-0">
            {preview}
          </button>
        ) : (
          preview
        )
      ) : (
        fallback
      )}
      <label className="flex items-center gap-2 text-sm font-medium text-ink-700 border border-ink-100 rounded-xl px-3 py-2 cursor-pointer hover:bg-ink-50">
        <Upload size={15} />
        Subir imagen
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>
    </div>
  )
}
