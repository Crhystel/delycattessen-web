import { useMemo, useState } from "react";
import { Plus, EyeOff } from "lucide-react";
import Topbar from "../../layouts/Topbar";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ImagePreviewOverlay from "../../components/ui/ImagePreviewOverlay";
import PageContainer from "../../components/ui/PageContainer";
import PageToolbar from "../../components/ui/PageToolbar";
import SearchInput from "../../components/ui/SearchInput";
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

      <PageContainer>
        <Card padded={false}>
          <div className="p-4 sm:p-5 border-b border-ink-100">
            <PageToolbar
              start={
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Buscar producto..."
                />
              }
              actions={
                <>
                  <Button
                    variant="outline"
                    onClick={() => setManageAllergensOpen(true)}
                  >
                    Gestionar alérgenos por ingrediente
                  </Button>
                  <Button icon={Plus} onClick={() => openForm()}>
                    Nuevo producto
                  </Button>
                </>
              }
            />
          </div>

          <div className="px-4 sm:px-5 py-2.5 border-b border-ink-100 bg-ink-50/50 text-xs text-ink-400 flex items-start gap-1.5">
            <EyeOff size={13} className="mt-0.5 shrink-0" />
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
      </PageContainer>

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
