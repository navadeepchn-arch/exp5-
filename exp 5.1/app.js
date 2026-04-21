// In-memory database
let DB = [
  { id: 1, name: 'iPhone 15', category: 'Electronics', price: 79999, stock: 10 },
  { id: 2, name: 'Running Shoes', category: 'Sports',      price: 4999,  stock: 0  },
  { id: 3, name: 'Air Fryer',    category: 'Appliances',   price: 6499,  stock: 5  },
];
let nextId = 4;

// Validation
function validate(name, price, category) {
  if (!name || name.trim().length < 2) return 'Name is required (min 2 chars)';
  if (price === '' || isNaN(price) || Number(price) < 0) return 'Price must be a positive number';
  if (!category) return 'Category is required';
  return null;
}

// CREATE
function createProduct() {
  const name     = document.getElementById('c-name').value.trim();
  const price    = document.getElementById('c-price').value;
  const category = document.getElementById('c-cat').value;
  const stock    = Number(document.getElementById('c-stock').value) || 0;
  const errEl    = document.getElementById('c-error');

  const err = validate(name, price, category);
  if (err) { errEl.textContent = err; return; }
  errEl.textContent = '';

  DB.push({ id: nextId++, name, category, price: Number(price), stock });

  // Clear form
  document.getElementById('c-name').value  = '';
  document.getElementById('c-price').value = '';
  document.getElementById('c-cat').value   = '';
  document.getElementById('c-stock').value = '0';

  renderTable();
}

// READ
function renderTable() {
  const query = document.getElementById('r-search').value.toLowerCase();
  const tbody = document.getElementById('table-body');

  const filtered = DB.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999">No products found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>₹${p.price.toLocaleString('en-IN')}</td>
      <td>${p.stock}</td>
      <td class="${p.stock > 0 ? 'in-stock' : 'out-stock'}">${p.stock > 0 ? 'Yes' : 'No'}</td>
      <td>
        <button class="edit"   onclick="openUpdate(${p.id})">Edit</button>
        <button class="delete" onclick="deleteProduct(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// UPDATE — open form
function openUpdate(id) {
  const p = DB.find(x => x.id === id);
  if (!p) return;
  document.getElementById('u-id').value    = p.id;
  document.getElementById('u-name').value  = p.name;
  document.getElementById('u-price').value = p.price;
  document.getElementById('u-cat').value   = p.category;
  document.getElementById('u-stock').value = p.stock;
  document.getElementById('update-section').style.display = 'block';
  document.getElementById('u-error').textContent = '';
}

// UPDATE — save
function updateProduct() {
  const id       = Number(document.getElementById('u-id').value);
  const name     = document.getElementById('u-name').value.trim();
  const price    = document.getElementById('u-price').value;
  const category = document.getElementById('u-cat').value;
  const stock    = Number(document.getElementById('u-stock').value) || 0;
  const errEl    = document.getElementById('u-error');

  const err = validate(name, price, category);
  if (err) { errEl.textContent = err; return; }
  errEl.textContent = '';

  const idx = DB.findIndex(p => p.id === id);
  if (idx === -1) return;
  DB[idx] = { id, name, category, price: Number(price), stock };

  cancelUpdate();
  renderTable();
}

function cancelUpdate() {
  document.getElementById('update-section').style.display = 'none';
}

// DELETE
function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  DB = DB.filter(p => p.id !== id);
  renderTable();
}

// Boot
renderTable();
