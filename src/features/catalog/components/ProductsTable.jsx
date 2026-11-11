import { EyeOff } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import DataTable from "../../../components/ui/DataTable";
import RowIconActions from "../../../components/ui/RowIconActions";
import { isImageSource } from "../../../lib/images";

// `discount_percentage`/`final_price` come from the backend and only reflect a
// promotion in force today, so an expired one shows the original price again.
function PriceCell({ product }) {
  if (!product.discount_percentage) {
    return (
      <span className="text-ink-700 font-medium">
        ${Number(product.price).toFixed(2)}
      </span>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-ink-300 line-through text-xs">
        ${Number(product.price).toFixed(2)}
      </span>
      <span className="text-teal-700 font-semibold">
        ${Number(product.final_price).toFixed(2)}
      </span>
      <Badge tone="success">-{product.discount_percentage}%</Badge>
    </div>
  );
}

function ProductInfo({ product, onPreview }) {
  const grayscale = product.stock <= 0 ? "grayscale" : "";

  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {isImageSource(product.image) ? (
        <button
          type="button"
          onClick={() => onPreview({ url: product.image, name: product.name })}
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
      <div className="min-w-0">
        <p className="font-medium text-ink-900">{product.name}</p>
        {product.description && (
          <p className="text-xs text-ink-400 line-clamp-1">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}

function VisibilityBadge({ product }) {
  if (product.stock > 0) return <Badge tone="success">Visible</Badge>;
  return (
    <Badge tone="danger">
      <EyeOff size={11} />
      Oculto · sin stock
    </Badge>
  );
}

function ProductActions({ product, onEdit, onDelete }) {
  return (
    <RowIconActions
      label="producto"
      onEdit={() => onEdit(product)}
      onDelete={() => onDelete(product.id)}
    />
  );
}

export default function ProductsTable({
  products,
  loading,
  showInstitution,
  onEdit,
  onDelete,
  onPreview,
}) {
  const columns = [
    {
      key: "product",
      header: "Producto",
      cell: (product) => (
        <ProductInfo product={product} onPreview={onPreview} />
      ),
    },
    {
      key: "category",
      header: "Categoría",
      className: "text-ink-500",
      cell: (product) => product.category,
    },
    ...(showInstitution
      ? [
          {
            key: "institution",
            header: "Sede",
            className: "text-ink-500",
            cell: (product) => product.institution_name,
          },
        ]
      : []),
    {
      key: "price",
      header: "Precio",
      cell: (product) => <PriceCell product={product} />,
    },
    {
      key: "stock",
      header: "Stock",
      className: "text-ink-700",
      cell: (product) => `${product.stock} u.`,
    },
    {
      key: "visibility",
      header: "Visibilidad",
      cell: (product) => <VisibilityBadge product={product} />,
    },
    {
      key: "actions",
      header: "Acciones",
      align: "right",
      cell: (product) => (
        <div className="flex justify-end">
          <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={products}
      rowKey={(product) => product.id}
      loading={loading}
      loadingText="Cargando productos..."
      emptyText="No se encontraron productos."
      rowClassName={(product) =>
        `transition-opacity ${product.stock <= 0 ? "opacity-50" : ""}`
      }
      renderCard={(product) => (
        <div className="space-y-3">
          <ProductInfo product={product} onPreview={onPreview} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            <PriceCell product={product} />
            <span className="text-ink-700">{product.stock} u.</span>
            <span className="text-ink-500">{product.category}</span>
            {showInstitution && (
              <span className="text-ink-400">{product.institution_name}</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <VisibilityBadge product={product} />
            <ProductActions
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>
      )}
    />
  );
}
