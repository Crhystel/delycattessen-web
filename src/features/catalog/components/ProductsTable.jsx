import { Pencil, Trash2, EyeOff } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import { isImageSource } from "../../../lib/images";
import { activePromoFor } from "../../../lib/promoRules";

function PriceCell({ product, promo }) {
  if (!promo) {
    return (
      <span className="text-ink-700 font-medium">
        ${Number(product.price).toFixed(2)}
      </span>
    );
  }
  const discounted = product.price * (1 - promo.discount / 100);
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-ink-300 line-through text-xs">
        ${Number(product.price).toFixed(2)}
      </span>
      <span className="text-teal-700 font-semibold">
        ${discounted.toFixed(2)}
      </span>
      <Badge tone="success">-{promo.discount}%</Badge>
    </div>
  );
}

function ProductRow({
  product,
  promo,
  showInstitution,
  onEdit,
  onDelete,
  onPreview,
}) {
  const hidden = product.stock <= 0;
  const grayscale = hidden ? "grayscale" : "";

  return (
    <tr
      className={`border-b border-ink-100 last:border-0 hover:bg-ink-50/60 transition-opacity ${
        hidden ? "opacity-50" : ""
      }`}
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-2.5">
          {isImageSource(product.image) ? (
            <button
              type="button"
              onClick={() =>
                onPreview({ url: product.image, name: product.name })
              }
              className="shrink-0"
            >
              <img
                src={product.image}
                alt={product.name}
                className={`w-16 h-12 rounded-lg object-cover cursor-zoom-in hover:opacity-80 transition-opacity ${grayscale}`}
              />
            </button>
          ) : (
            <span className={`text-xl ${grayscale}`}>🍴</span>
          )}
          <div>
            <p className="font-medium text-ink-900">{product.name}</p>
            {product.description && (
              <p className="text-xs text-ink-400 line-clamp-1">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-5 py-3 text-ink-500">{product.category}</td>
      {showInstitution && (
        <td className="px-5 py-3 text-ink-500">{product.institution_name}</td>
      )}
      <td className="px-5 py-3">
        <PriceCell product={product} promo={promo} />
      </td>
      <td className="px-5 py-3 text-ink-700">{product.stock} u.</td>
      <td className="px-5 py-3">
        {hidden ? (
          <Badge tone="danger">
            <EyeOff size={11} />
            Oculto · sin stock
          </Badge>
        ) : (
          <Badge tone="success">Visible</Badge>
        )}
      </td>
      <td className="px-5 py-3 text-right">
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => onEdit(product)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-danger-500 hover:bg-danger-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ProductsTable({
  products,
  loading,
  promotions,
  showInstitution,
  onEdit,
  onDelete,
  onPreview,
}) {
  const colSpan = showInstitution ? 7 : 6;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-500 border-b border-ink-100">
            <th className="px-5 py-3 font-medium">Producto</th>
            <th className="px-5 py-3 font-medium">Categoría</th>
            {showInstitution && (
              <th className="px-5 py-3 font-medium">Sede</th>
            )}
            <th className="px-5 py-3 font-medium">Precio</th>
            <th className="px-5 py-3 font-medium">Stock</th>
            <th className="px-5 py-3 font-medium">Visibilidad</th>
            <th className="px-5 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={colSpan}
                className="px-5 py-8 text-center text-ink-300"
              >
                Cargando productos...
              </td>
            </tr>
          )}
          {!loading &&
            products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                promo={activePromoFor(product.id, promotions)}
                showInstitution={showInstitution}
                onEdit={onEdit}
                onDelete={onDelete}
                onPreview={onPreview}
              />
            ))}
          {!loading && products.length === 0 && (
            <tr>
              <td
                colSpan={colSpan}
                className="px-5 py-8 text-center text-ink-300"
              >
                No se encontraron productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
