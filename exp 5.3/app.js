// In-memory store
let products = [
  {
    _id: uid(), name: 'iPhone 15 Pro', brand: 'Apple',
    category: 'Electronics', price: 129999, rating: 4.8,
    description: 'Latest Apple flagship.',
    variants: [
      { sku: 'IPH-BLK', color: 'Black',    size: '256GB', stock: 20 },
      { sku: 'IPH-WHT', color: 'White',    size: '256GB', stock: 0  },
      { sku: 'IPH-TIT', color: 'Titanium', size: '512GB', stock: 5  },
    ],
    inStock: true,
  },
  {
    _id: uid(), name: 'Running Shoes X', brand: 'Nike',
    category: 'Sports', price: 8999, rating: 4.3,
    description: 'Lightweight marathon shoes.',
    variants: [
      { sku: 'NK-S8',  color: 'Blue', size: 'UK 8',  stock: 0  },
      { sku: 'NK-S9',  color: 'Blue', size: 'UK 9',  stock: 12 },
      { sku: 'NK-S10', color: 'Red',  size: 'UK 10', stock: 3  },
    ],
    inStock: true,
  },
  {
    _id: uid(), name: 'Air Fryer 5L', brand: 'Philips',
    category: 'Appliances', price: 7499, rating: 4.6,
    description: '80% less oil cooking.',
    variants: [{ sku: 'AF-WHT', color: 'White', size: '5L', stock: 8 }],
    inStock: true,
  },
  {
    _id: uid(), name: 'Cotton Kurta Set', brand: 'Fabindia',
    category: 'Clothing', price: 1899, rating: 4.1,
    description: 'Premium handwoven cotton.',
    variants: [
      { sku: 'KT-S', color: 'White', size: 'S', stock: 0 },
      { sku: 'KT-M', color: 'White', size: 'M', stock: 0 },
      { sku: 'KT-L', color: 'Blue',  size: 'L', stock: 2 },
    ],
    inStock: true,
  },
  {
    _id: uid(), name: 'Bamboo Shelf', brand: 'Wooden Street',
    category: 'Home', price: 3299, rating: null,
    description: '3-tier bamboo storage.',
    variants: [{ sku: 'BS-NAT', color: 'Natural', size: '3-tier', stock: 0 }],
    inStock: false,
  },
];

// Helpers
function uid() { return Math.random().toString(36).slice(2, 10); }
function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}

// Pre-save middleware simulation
function preSave(p) {
  p.inStock = p.variants.reduce((s, v) => s + v.stock, 0) > 0;
  return p;
}

// Validate
function validate(data) {
  if (!data.name || data.name.trim().length < 2) return 'Name is required (min 2 chars).';
  if (!data.category) return 'Category is required.';
  if (data.price === '' || isNaN(Number(data.price)) || Number(data.price) < 0) return 'Valid price is required.';
  if (!data.sku) return 'SKU is required.';
  if (isNaN(Number(data.stock)) || Number(data.stock) < 0) return 'Stock must be 0 or more.';
  return null;
}

// CREATE
function addProduct() {
  const data = {
    name:     document.getElementById('f-name').value.trim(),
    brand:    document.getElementById('f-brand').value.trim(),
    category: document.getElementById('f-category').value,
    price:    document.getElementById('f-price').value,
    rating:   document.getElementById('f-rating').value,
    description: document.getElementById('f-desc').value.trim(),
    sku:      document.getElementById('f-sku').value.trim(),
    color:    document.getElementById('f-color').value.trim(),
    size:     document.getElementById('f-size').value.trim(),
    stock:    document.getElementById('f-stock').value,
  };

  const err = validate(data);
  document.getElementById('form-error').textContent = err || '';
  if (err) return;

  const product = preSave({
    _id: uid(),
    name: data.name, brand: data.brand || '',
    category: data.category,
    price: parseFloat(data.price),
    rating: data.rating !== '' ? parseFloat(data.rating) : null,
    description: data.description,
    variants: [{
      sku: data.sku, color: data.color || '',
      size: data.size || '', stock: parseInt(data.stock) || 0,
    }],
    inStock: false,
  });

  products.unshift(product);
  renderAll();
  resetForm();
  toast('Product "' + product.name + '" added!', 'success');
}

function resetForm() {
  ['f-name','f-brand','f-price','f-rating','f-desc','f-sku','f-color','f-size'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('f-category').value = '';
  document.getElementById('f-stock').value = '0';
  document.getElementById('form-error').textContent = '';
}

// READ
function renderTable() {
  const q   = (document.getElementById('search').value || '').toLowerCase();
  const cat = document.getElementById('filter-cat').value;
  const data = products.filter(p => {
    const matchQ   = !q   || p.name.toLowerCase().includes(q) || (p.brand||'').toLowerCase().includes(q);
    const matchCat = !cat || p.category === cat;
    return matchQ && matchCat;
  });

  document.getElementById('product-count').textContent = products.length;
  const tbody = document.getElementById('product-tbody');

  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty">No products found.</div></td></tr>';
    return;
  }

  tbody.innerHTML = data.map((p, i) => {
    const varList = p.variants.map(v => {
      const c = v.stock === 0 ? '#ef4444' : v.stock < 10 ? '#d97706' : '#16a34a';
      return `<div class="variant-row">
        <b>${esc(v.sku)}</b> · ${esc(v.color || '—')}${v.size ? ' / ' + esc(v.size) : ''}
        · Stock: <b style="color:${c}">${v.stock}</b>
      </div>`;
    }).join('');

    return `<tr>
      <td style="color:#aaa;font-size:.72rem">${i + 1}</td>
      <td><b>${esc(p.name)}</b><br><span style="font-size:.7rem;color:#888">${esc(p.description)}</span></td>
      <td><span class="chip chip-${p.category}">${p.category}</span></td>
      <td>${esc(p.brand) || '—'}</td>
      <td style="font-weight:700;color:#1a5fb4">₹${p.price.toLocaleString('en-IN')}</td>
      <td>${p.rating !== null ? '⭐ ' + p.rating : '—'}</td>
      <td>${varList}</td>
      <td><span class="${p.inStock ? 'in-stock' : 'out-stock'}">${p.inStock ? '✔ Yes' : '✘ No'}</span></td>
      <td><button class="btn btn-red" onclick="deleteProduct('${p._id}')">Delete</button></td>
    </tr>`;
  }).join('');
}

// DELETE
function deleteProduct(id) {
  const p = products.find(x => x._id === id);
  if (!p || !confirm('Delete "' + p.name + '"?')) return;
  products = products.filter(x => x._id !== id);
  renderAll();
  toast('"' + p.name + '" deleted.', 'error');
}

// STATS
function renderStats() {
  const total    = products.length;
  const inStock  = products.filter(p => p.inStock).length;
  const outStock = products.filter(p => !p.inStock).length;
  const variants = products.reduce((s, p) => s + p.variants.length, 0);
  document.getElementById('stats-row').innerHTML = `
    <div class="stat-box"><div class="num n-blue">${total}</div><div class="lbl">Total Products</div></div>
    <div class="stat-box"><div class="num n-green">${inStock}</div><div class="lbl">In Stock</div></div>
    <div class="stat-box"><div class="num n-red">${outStock}</div><div class="lbl">Out of Stock</div></div>
    <div class="stat-box"><div class="num n-orange">${variants}</div><div class="lbl">Total Variants</div></div>`;
}

// AGGREGATION
const PIPELINES = {
  lowStock: {
    title: 'Low Stock Products ($unwind → $match stock < 10)',
    code: `Product.aggregate([\n  { $unwind: "$variants" },\n  { $match: { "variants.stock": { $lt: 10 } } },\n  { $group: { _id: "$_id", name: { $first: "$name" }, variants: { $push: "$variants" } } }\n])`,
  },
  categoryRatings: {
    title: 'Avg Rating by Category ($group → $avg → $sort)',
    code: `Product.aggregate([\n  { $group: {\n      _id: "$category",\n      avgRating: { $avg: "$rating" },\n      count: { $sum: 1 }\n  }},\n  { $sort: { avgRating: -1 } }\n])`,
  },
  stockSummary: {
    title: 'Stock Summary per Category ($unwind → $group → $sum)',
    code: `Product.aggregate([\n  { $unwind: "$variants" },\n  { $group: {\n      _id: "$category",\n      totalStock: { $sum: "$variants.stock" },\n      lowCount: { $sum: { $cond: [{ $lt: ["$variants.stock", 10] }, 1, 0] } }\n  }}\n])`,
  },
  priceRange: {
    title: 'Price Range Stats ($group → $min → $max → $avg)',
    code: `Product.aggregate([\n  { $group: {\n      _id: "$category",\n      minPrice: { $min: "$price" },\n      maxPrice: { $max: "$price" },\n      avgPrice: { $avg: "$price" }\n  }}\n])`,
  },
};

function runAgg(type) {
  const pl = PIPELINES[type];
  document.getElementById('agg-pipeline-code').innerHTML =
    `<div style="background:#1e2a38;border-radius:6px;padding:14px;margin-bottom:12px">
      <div style="font-size:.68rem;color:#7ab8c8;margin-bottom:6px;font-weight:700">${esc(pl.title)}</div>
      <pre style="margin:0;padding:0;background:transparent;font-size:.75rem">${esc(pl.code)}</pre>
    </div>`;

  let result = '';

  if (type === 'lowStock') {
    const low = products
      .map(p => ({ ...p, variants: p.variants.filter(v => v.stock < 10) }))
      .filter(p => p.variants.length > 0);
    result = low.length
      ? low.map(p =>
          `<div style="margin-bottom:8px"><div class="agg-label">● ${esc(p.name)}</div>` +
          p.variants.map(v =>
            `<div><span class="agg-key">sku:</span> <span class="agg-val">"${esc(v.sku)}"</span> · <span class="agg-key">stock:</span> <span class="agg-warn">${v.stock}</span> ${v.stock === 0 ? '⚠ OUT' : '⚡ LOW'}</div>`
          ).join('') + `</div>`
        ).join('')
      : '<span style="color:#888">No low-stock products.</span>';
  }

  else if (type === 'categoryRatings') {
    const cats = {};
    products.forEach(p => {
      if (!cats[p.category]) cats[p.category] = { sum: 0, cnt: 0 };
      if (p.rating !== null) { cats[p.category].sum += p.rating; cats[p.category].cnt++; }
    });
    result = Object.entries(cats).map(([cat, d]) => {
      const avg = d.cnt > 0 ? (d.sum / d.cnt).toFixed(2) : 'null';
      return `<div><span class="agg-key">_id:</span> <span class="agg-val">"${cat}"</span> · <span class="agg-key">avgRating:</span> <span class="agg-num">${avg}</span> · <span class="agg-key">count:</span> <span class="agg-num">${d.cnt}</span></div>`;
    }).join('');
  }

  else if (type === 'stockSummary') {
    const cats = {};
    products.forEach(p => {
      if (!cats[p.category]) cats[p.category] = { total: 0, low: 0 };
      p.variants.forEach(v => {
        cats[p.category].total += v.stock;
        if (v.stock < 10) cats[p.category].low++;
      });
    });
    result = Object.entries(cats).map(([cat, d]) =>
      `<div><span class="agg-key">_id:</span> <span class="agg-val">"${cat}"</span> · <span class="agg-key">totalStock:</span> <span class="agg-num">${d.total}</span> · <span class="agg-key">lowVariants:</span> <span class="${d.low > 0 ? 'agg-warn' : 'agg-num'}">${d.low}</span></div>`
    ).join('');
  }

  else if (type === 'priceRange') {
    const cats = {};
    products.forEach(p => {
      if (!cats[p.category]) cats[p.category] = { prices: [] };
      cats[p.category].prices.push(p.price);
    });
    result = Object.entries(cats).map(([cat, d]) => {
      const min = Math.min(...d.prices);
      const max = Math.max(...d.prices);
      const avg = Math.round(d.prices.reduce((a, b) => a + b, 0) / d.prices.length);
      return `<div><span class="agg-key">_id:</span> <span class="agg-val">"${cat}"</span> · <span class="agg-key">min:</span> <span class="agg-num">₹${min.toLocaleString('en-IN')}</span> · <span class="agg-key">max:</span> <span class="agg-num">₹${max.toLocaleString('en-IN')}</span> · <span class="agg-key">avg:</span> <span class="agg-num">₹${avg.toLocaleString('en-IN')}</span></div>`;
    }).join('');
  }

  document.getElementById('agg-output').innerHTML =
    `<div class="agg-label">Result:</div><div class="agg-result">${result}</div>`;
}

// STOCK MANAGEMENT
function loadVariants() {
  const id  = document.getElementById('s-product').value;
  const sel = document.getElementById('s-variant');
  const p   = products.find(x => x._id === id);
  sel.innerHTML = '<option value="">— Select Variant —</option>';
  if (!p) return;
  p.variants.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.sku;
    opt.textContent = v.sku + ' · ' + (v.color || '') + (v.size ? ' / ' + v.size : '') + ' — Stock: ' + v.stock;
    sel.appendChild(opt);
  });
}

function updateStock() {
  const id  = document.getElementById('s-product').value;
  const sku = document.getElementById('s-variant').value;
  const qty = parseInt(document.getElementById('s-qty').value);
  if (!id)  return toast('Select a product.', 'error');
  if (!sku) return toast('Select a variant.', 'error');
  if (isNaN(qty) || qty < 0) return toast('Enter valid stock (≥ 0).', 'error');

  const p = products.find(x => x._id === id);
  const v = p?.variants.find(x => x.sku === sku);
  if (!v) return;
  v.stock = qty;
  preSave(p);
  renderAll();
  document.getElementById('s-qty').value = '';
  toast('Stock updated: ' + sku + ' → ' + qty + ' units', 'success');
}

function renderStockTable() {
  const rows = [];
  products.forEach(p => {
    p.variants.forEach(v => {
      const status = v.stock === 0 ? '⚠ Out of Stock' : v.stock < 10 ? '⚡ Low Stock' : '✔ OK';
      const color  = v.stock === 0 ? '#ef4444' : v.stock < 10 ? '#d97706' : '#16a34a';
      rows.push(`<tr>
        <td><b>${esc(p.name)}</b></td>
        <td style="font-family:monospace">${esc(v.sku)}</td>
        <td><span class="chip chip-${p.category}">${p.category}</span></td>
        <td>${esc(v.color || '—')}${v.size ? ' / ' + esc(v.size) : ''}</td>
        <td style="font-weight:700;color:${color}">${v.stock}</td>
        <td style="color:${color};font-weight:600">${status}</td>
      </tr>`);
    });
  });
  document.getElementById('stock-tbody').innerHTML = rows.join('') ||
    '<tr><td colspan="6"><div class="empty">No variants.</div></td></tr>';

  const sel = document.getElementById('s-product');
  const cur = sel.value;
  sel.innerHTML = '<option value="">— Select Product —</option>' +
    products.map(p => `<option value="${p._id}">${esc(p.name)}</option>`).join('');
  if (products.find(p => p._id === cur)) sel.value = cur;
}

// TABS
function showTab(name) {
  ['products', 'schema', 'aggregation', 'stock'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === name ? '' : 'none';
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.toLowerCase().includes(name.slice(0, 4)));
    });
  });
  if (name === 'stock') renderStockTable();
}

// TOAST
let _tt;
function toast(msg, type) {
  clearTimeout(_tt);
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show ' + (type || '');
  _tt = setTimeout(() => el.className = '', 3000);
}

// RENDER ALL
function renderAll() {
  renderStats();
  renderTable();
  renderStockTable();
}

renderAll();