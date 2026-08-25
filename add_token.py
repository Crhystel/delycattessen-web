import os
import re

def add_token(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add token to GET
    content = re.sub(r"axios\.get\((.*?)\)", r"axios.get(\1, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } })", content)

    # Add token to POST
    content = re.sub(r"axios\.post\((.*?),\s*(.*?)\)", r"axios.post(\1, \2, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } })", content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

add_token('src/pages/admin/Products.jsx')
add_token('src/views/admin/ProductCreateView.jsx')
print('Added tokens to axios')
