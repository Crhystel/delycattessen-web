import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import BaseDashboardLayout from '../../components/layouts/BaseDashboardLayout';

const ProductCreateView = () => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 0,
    ingredients: [],
  });

  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Obtiene los ingredientes desde el backend al cargar la pantalla
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/catalog/ingredients/');
        setAvailableIngredients(response.data);
      } catch (error) {
        toast.error("Failed to load ingredients from server");
      }
    };
    fetchIngredients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({ ...prev, ingredients: selectedOptions }));
  };

  // Envía el formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación estricta UI: Ingredientes requeridos
    if (formData.ingredients.length === 0) {
      toast.error('Validation Error: You must select at least one ingredient');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/catalog/menu/create/', formData);
      toast.success('Product created successfully!');
      
      // Limpia el formulario
      setFormData({ name: '', description: '', price: '', stock: 0, ingredients: [] });
    } catch (error) {
      // Captura el error 400 del IngredientValidationMixin (Django)
      const errorMsg = error.response?.data?.ingredients 
        || error.response?.data?.detail 
        || "An error occurred while saving";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseDashboardLayout userName="Admin">
      <Toaster position="top-right" />
      
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="mb-8 border-b pb-4">
            <h3 className="text-2xl font-bold text-gray-800">Create New Product</h3>
            <p className="text-gray-500 mt-1">Fill in the details to add a new item to the catalog.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Classic Burger"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">If set to 0, product will be hidden automatically.</p>
              </div>

              {/* Ingredients (Multi-Select) */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ingredients * <span className="text-red-500">(Required for Allergen Validation)</span>
                </label>
                <select
                  multiple
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleIngredientChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-32"
                >
                  {availableIngredients.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</p>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Product description..."
                ></textarea>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={"px-6 py-2 rounded-lg text-white font-medium " + (isLoading ? "bg-orange-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700")}
              >
                {isLoading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BaseDashboardLayout>
  );
};

export default ProductCreateView;
