import os

file_path = 'src/App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'ProductCreateView' not in content:
    content = content.replace('import Products from "./pages/admin/Products";', 'import Products from "./pages/admin/Products";\nimport ProductCreateView from "./views/admin/ProductCreateView";')
    content = content.replace('<Route path="products" element={<Products />} />', '<Route path="products" element={<Products />} />\n                <Route path="products/create" element={<ProductCreateView />} />')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('App.jsx updated')
