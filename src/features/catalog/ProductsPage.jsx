import { useMemo, useState } from "react";
import { Plus, Search, EyeOff } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ImagePreviewOverlay from "../../components/ui/ImagePreviewOverlay";
import { useInstitution } from "../../context/InstitutionContext";
import { ALL_INSTITUTIONS } from "../../lib/institutions";
import { useProducts } from "./hooks/useProducts";
import { useIngredientCatalog } from "./hooks/useIngredientCatalog";
import ProductsTable from "./components/ProductsTable";
import ProductFormModal from "./components/ProductFormModal";
import ManageAllergensModal from "./components/ManageAllergensModal";

export default function ProductsPage() {
  const { selectedInstitution } = useInstitution();
  const { products, loading, saveProduct, removeProduct } = useProducts();
  const catalog = useIngredientCatalog();

  const [query, setQuery] = useState("");
  // `form` is { product } while the product form is open (product null = create).
  const [form, setForm] = useState(null);
  const [manageAllergensOpen, setManageAllergensOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const filtered = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [products, query],
  );

  function openForm(product = null) {
    setForm({ product });
  }

  return (
    <>
      <Topbar
        title="Catálogo e Inventario"
        subtitle="Gestión de productos, ingredientes y stock"
      />

      <main className="p-6 space-y-5">
        <Card padded={false}>
          <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b border-ink-100">
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-ink-100 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setManageAllergensOpen(true)}
              >
                Gestionar alérgenos por ingrediente
              </Button>
              <Button icon={Plus} onClick={() => openForm()}>
                Nuevo producto
              </Button>
            </div>
          </div>

          <div className="px-5 py-2.5 border-b border-ink-100 bg-ink-50/50 text-xs text-ink-400 flex items-center gap-1.5">
            <EyeOff size={13} />
            Los productos con stock en cero se atenúan y quedan ocultos
            automáticamente del catálogo activo.
          </div>

          <ProductsTable
            products={filtered}
            loading={loading}
            showInstitution={selectedInstitution === ALL_INSTITUTIONS}
            onEdit={openForm}
            onDelete={removeProduct}
            onPreview={setPreviewImage}
          />
        </Card>
      </main>

      {form && (
        <ProductFormModal
          product={form.product}
          catalog={catalog}
          onSave={saveProduct}
          onClose={() => setForm(null)}
          onPreviewImage={setPreviewImage}
        />
      )}

      <ManageAllergensModal
        open={manageAllergensOpen}
        onClose={() => setManageAllergensOpen(false)}
        catalog={catalog}
      />

      <ImagePreviewOverlay
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );
}
