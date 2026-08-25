import os

file_path = 'src/pages/admin/Products.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
if 'import axios from' not in content:
    content = content.replace("import { useMemo, useState } from 'react'", "import { useMemo, useState, useEffect } from 'react'\nimport { useNavigate } from 'react-router-dom'\nimport axios from 'axios'")

# Change initial state
content = content.replace("const [items, setItems] = useState(initialProducts)", "const [items, setItems] = useState([])")

# Add useEffect
use_effect = """
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/catalog/menu/')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);
"""
if 'useEffect(()' not in content:
    content = content.replace("const [query, setQuery] = useState('')", "const [query, setQuery] = useState('')\n" + use_effect)

# Change openNew
content = content.replace("""  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }""", """  function openNew() {
    navigate('/admin/products/create')
  }""")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Products.jsx updated')
