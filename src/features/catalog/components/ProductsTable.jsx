import DataTable from "../../../components/ui/DataTable";
import VisibilityBadge from "../../../components/ui/VisibilityBadge";
import RowIconActions from "../../../components/ui/RowIconActions";
import { isImageSource } from "../../../lib/images";

function PriceCell({ product }) {
  return (
    <span className="text-ink-700 font-medium">
      ${Number(product.price).toFixed(2)}
    </span>
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

function ProductActions({ product, onEdit, onDelete }) {
  function handleDelete() {
    if (
      window.confirm(
        `¿Eliminar el producto "${product.name}"? Dejará de ofrecerse en caja.`,
      )
    )
      onDelete(product.id);
  }

  return (
    <RowIconActions
      label="producto"
      onEdit={() => onEdit(product)}
      onDelete={handleDelete}
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
      cell: (product) => <VisibilityBadge visible={product.stock > 0} />,
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
            <VisibilityBadge visible={product.stock > 0} />
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
