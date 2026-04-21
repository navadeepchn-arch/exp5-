// ══════════════════════════════════════
//  SHARED HELPERS
// ══════════════════════════════════════
function uid() { return Math.random().toString(36).slice(2, 10); }
function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])
  );
}
let _tt;
function toast(msg, type) {
  clearTimeout(_tt);
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show ' + (type || '');
  _tt = setTimeout(() => el.className = '', 3000);
}

// ══════════════════════════════════════
//  TOP NAV — show experiment
// ══════════════════════════════════════
function showExp(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById('exp-' + i).style.display = i === n ? '' : 'none';
    document.getElementById('nav-' + i).classList.toggle('active', i === n);
  });
}

// ══════════════════════════════════════
//  EXP 5.1 — Mongoose CRUD Product
// ══════════════════════════════════════
let p1_db = [
  { id: uid(), name: 'iPhone 15 Pro', brand: 'Apple',    category: 'Electronics', price: 129999, stock: 25 },
  { id: uid(), name: 'Running Shoes', brand: 'Nike',     category: 'Sports',      price: 8999,   stock: 0  },
  { id: uid(), name: 'Air Fryer 5L',  brand: 'Philips',  category: 'Appliances',  price: 7499,   stock: 12 },
];

function p1_validate(name, price, category) {
  if (!name || name.trim().length < 2) return 'Name is required (min 2 chars).';
  if (!category) return 'Category is required.';
  if (price === '' || isNaN(Number(price)) || Number(price) < 0) return 'Valid price required.';
  return null;
}

function p1_create() {
  const name     = document.getElementById('c-name').value.trim();
  const brand    = document.getElementById('c-brand').value.trim();
  const category = document.getElementById('c-cat').value;
  const price    = document.getElementById('c-price').value;
  const stock    = parseInt(document.getElementById('c-stock').value) || 0;
  const errEl    = document.getElementById('c-error');

  const err = p1_validate(name, price, category);
  if (err) { errEl.textContent = err; return; }
  errEl.textContent = '';

  p1_db.unshift({ id: uid(), name, brand, category, price: parseFloat(price), stock });
  document.getElementById('c-name').value  = '';
  document.getElementById('c-brand').value = '';
  document.getElementById('c-cat').value   = '';
  document.getElementById('c-price').value = '';
  document.getElementById('c-stock').value = '0';
  p1_render();
  toast('Product added!', 'success');
}

function p1_render() {
  const q   = (document.getElementById('p1-search').value || '').toLowerCase();
  const cat = document.getElementById('p1-cat').value;
  const data = p1_db.filter(p => {
    const mq  = !q   || p.name.toLowerCase().includes(q) || (p.brand||'').toLowerCase().includes(q);
    const mc  = !cat || p.category === cat;
    return mq && mc;
  });
  document.getElementById('p1-count').textContent = p1_db.length;
  const tbody = document.getElementById('p1-tbody');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="empty">No products found.</div></td></tr>';
    return;
  }
  tbody.innerHTML = data.map(p => `<tr>
    <td><b>${esc(p.name)}</b></td>
    <td><span class="chip chip-${p.category}">${p.category}</span></td>
    <td>${esc(p.brand) || '—'}</td>
    <td style="font-weight:700;color:#1a5fb4">₹${p.price.toLocaleString('en-IN')}</td>
    <td>${p.stock}</td>
    <td><span class="${p.stock > 0 ? 'in-stock' : 'out-stock'}">${p.stock > 0 ? 'true' : 'false'}</span></td>
    <td style="display:flex;gap:6px">
      <button class="btn-edit" onclick="p1_openUpdate('${p.id}')">Edit</button>
      <button class="btn btn-red" onclick="p1_delete('${p.id}')">Delete</button>
    </td>
  </tr>`).join('');
}

function p1_openUpdate(id) {
  const p = p1_db.find(x => x.id === id);
  if (!p) return;
  document.getElementById('u-id').value    = p.id;
  document.getElementById('u-name').value  = p.name;
  document.getElementById('u-brand').value = p.brand;
  document.getElementById('u-cat').value   = p.category;
  document.getElementById('u-price').value = p.price;
  document.getElementById('u-stock').value = p.stock;
  document.getElementById('p1-update-card').style.display = '';
}

function p1_update() {
  const id       = document.getElementById('u-id').value;
  const name     = document.getElementById('u-name').value.trim();
  const brand    = document.getElementById('u-brand').value.trim();
  const category = document.getElementById('u-cat').value;
  const price    = document.getElementById('u-price').value;
  const stock    = parseInt(document.getElementById('u-stock').value) || 0;

  const err = p1_validate(name, price, category);
  if (err) { toast(err, 'error'); return; }

  const idx = p1_db.findIndex(x => x.id === id);
  if (idx === -1) return;
  p1_db[idx] = { id, name, brand, category, price: parseFloat(price), stock };
  p1_cancelUpdate();
  p1_render();
  toast('Product updated!', 'success');
}

function p1_cancelUpdate() {
  document.getElementById('p1-update-card').style.display = 'none';
}

function p1_delete(id) {
  const p = p1_db.find(x => x.id === id);
  if (!p || !confirm('Delete "' + p.name + '"?')) return;
  p1_db = p1_db.filter(x => x.id !== id);
  p1_render();
  toast('"' + p.name + '" deleted.', 'error');
}

// ══════════════════════════════════════
//  EXP 5.2 — Student Management
// ══════════════════════════════════════
let s_db = JSON.parse(localStorage.getItem('sms_students') || '[]');
let s_editingId = null;

if (s_db.length === 0) {
  s_db = [
    { id: 1, name: 'Michael Johnson', roll: 1, grade: 'A', email: 'michael@school.edu' },
    { id: 2, name: 'Emma Williams',   roll: 2, grade: 'B', email: 'emma@school.edu'   },
    { id: 3, name: 'Liam Anderson',   roll: 3, grade: 'A', email: 'liam@school.edu'   },
  ];
  s_save();
}

function s_save() {
  localStorage.setItem('sms_students', JSON.stringify(s_db));
}

function s_render() {
  const q = (document.getElementById('s-search').value || '').toLowerCase();
  const list = q
    ? s_db.filter(s => s.name.toLowerCase().includes(q) || String(s.roll).includes(q) || (s.email||'').toLowerCase().includes(q))
    : s_db;

  document.getElementById('s-count-label').textContent = s_db.length + ' students enrolled';
  const container = document.getElementById('s-list');

  if (!list.length) {
    container.innerHTML = '<div class="empty">No students found.</div>';
    return;
  }

  container.innerHTML = [...list].sort((a, b) => a.roll - b.roll).map(s => `
    <div class="s-card">
      <div class="s-card-body">
        <div class="s-name">${esc(s.name)}</div>
        <div class="s-roll">Roll: ${s.roll}</div>
        ${s.grade ? `<div class="s-grade">Grade: <span class="chip grade-${s.grade.toLowerCase()}">${s.grade}</span></div>` : ''}
        ${s.email ? `<div class="s-email">${esc(s.email)}</div>` : ''}
      </div>
      <hr class="s-divider">
      <div class="s-actions">
        <button class="btn-edit" onclick="s_openEdit(${s.id})">Edit</button>
        <button class="btn btn-red" onclick="s_delete(${s.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function s_openAdd() {
  s_editingId = null;
  document.getElementById('s-modal-title').textContent = 'New Student';
  document.getElementById('s-submit-btn').textContent  = 'Add Student';
  document.getElementById('s-name').value  = '';
  document.getElementById('s-roll').value  = '';
  document.getElementById('s-grade').value = '';
  document.getElementById('s-email').value = '';
  document.getElementById('s-error').textContent = '';
  document.getElementById('s-modal').classList.add('open');
  document.getElementById('s-overlay').classList.add('open');
}

function s_openEdit(id) {
  const s = s_db.find(x => x.id === id);
  if (!s) return;
  s_editingId = id;
  document.getElementById('s-modal-title').textContent = 'Edit Student';
  document.getElementById('s-submit-btn').textContent  = 'Save Changes';
  document.getElementById('s-name').value  = s.name;
  document.getElementById('s-roll').value  = s.roll;
  document.getElementById('s-grade').value = s.grade || '';
  document.getElementById('s-email').value = s.email || '';
  document.getElementById('s-error').textContent = '';
  document.getElementById('s-modal').classList.add('open');
  document.getElementById('s-overlay').classList.add('open');
}

function s_closeModal() {
  document.getElementById('s-modal').classList.remove('open');
  document.getElementById('s-overlay').classList.remove('open');
}

function s_submit() {
  const name  = document.getElementById('s-name').value.trim();
  const roll  = Number(document.getElementById('s-roll').value);
  const grade = document.getElementById('s-grade').value;
  const email = document.getElementById('s-email').value.trim();
  const errEl = document.getElementById('s-error');

  if (!name)  { errEl.textContent = 'Full name is required.'; return; }
  if (!roll)  { errEl.textContent = 'Roll number is required.'; return; }
  if (s_db.some(s => s.roll === roll && s.id !== s_editingId)) {
    errEl.textContent = 'Roll number ' + roll + ' is already taken.'; return;
  }
  errEl.textContent = '';

  if (s_editingId) {
    const idx = s_db.findIndex(s => s.id === s_editingId);
    s_db[idx] = { id: s_editingId, name, roll, grade, email };
    toast('Student updated.', 'success');
  } else {
    s_db.push({ id: Date.now(), name, roll, grade, email });
    toast('Student added.', 'success');
  }
  s_save();
  s_closeModal();
  s_render();
}

function s_delete(id) {
  const s = s_db.find(x => x.id === id);
  if (!s || !confirm('Delete "' + s.name + '"?')) return;
  s_db = s_db.filter(x => x.id !== id);
  s_save();
  s_render();
  toast(s.name + ' removed.', 'error');
}

// ══════════════════════════════════════
//  EXP 5.3 — Nested Schema
// ══════════════════════════════════════
let p3_db = [
  {
    _id: uid(), name: 'iPhone 15 Pro', brand: 'Apple',
    category: 'Electronics', price: 129999, rating: 4.8,
    description: 'Latest Apple flagship.',
    variants: [
      { sku: 'IPH-BLK', color: 'Black',    size: '256GB', stock: 20 },
      { sku: 'IPH-WHT', color: 'White',    size: '256GB', stock: 0  },
      { sku: 'IPH-TIT', color: 'Titanium', size: '512GB', stock: 5  },
    ], inStock: true,
  },
  {
    _id: uid(), name: 'Running Shoes X', brand: 'Nike',
    category: 'Sports', price: 8999, rating: 4.3,
    description: 'Lightweight marathon shoes.',
    variants: [
      { sku: 'NK-S8',  color: 'Blue', size: 'UK 8',  stock: 0  },
      { sku: 'NK-S9',  color: 'Blue', size: 'UK 9',  stock: 12 },
    ], inStock: true,
  },
  {
    _id: uid(), name: 'Air Fryer 5L', brand: 'Philips',
    category: 'Appliances', price: 7499, rating: 4.6,
    description: '80% less oil cooking.',
    variants: [{ sku: 'AF-WHT', color: 'White', size: '5L', stock: 8 }],
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

function p3_preSave(p) {
  p.inStock = p.variants.reduce((s, v) => s + v.stock, 0) > 0;
  return p;
}

function p3_add() {
  const name     = document.getElementById('p3-name').value.trim();
  const brand    = document.getElementById('p3-brand').value.trim();
  const category = document.getElementById('p3-cat').value;
  const price    = document.getElementById('p3-price').value;
  const rating   = document.getElementById('p3-rating').value;
  const desc     = document.getElementById('p3-desc').value.trim();
  const sku      = document.getElementById('p3-sku').value.trim();
  const color    = document.getElementById('p3-color').value.trim();
  const size     = document.getElementById('p3-size').value.trim();
  const stock    = document.getElementById('p3-stock').value;
  const errEl    = document.getElementById('p3-error');

  if (!name || name.length < 2) { errEl.textContent = 'Name required (min 2 chars).'; return; }
  if (!category)                { errEl.textContent = 'Category required.'; return; }
  if (!price || Number(price) < 0) { errEl.textContent = 'Valid price required.'; return; }
  if (!sku)                     { errEl.textContent = 'SKU required.'; return; }
  errEl.textContent = '';

  const product = p3_preSave({
    _id: uid(), name, brand: brand || '', category,
    price: parseFloat(price),
    rating: rating !== '' ? parseFloat(rating) : null,
    description: desc,
    variants: [{ sku, color: color || '', size: size || '', stock: parseInt(stock) || 0 }],
    inStock: false,
  });

  p3_db.unshift(product);
  p3_reset();
  p3_renderAll();
  toast('Product "' + product.name + '" added!', 'success');
}

function p3_reset() {
  ['p3-name','p3-brand','p3-price','p3-rating','p3-desc','p3-sku','p3-color','p3-size'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('p3-cat').value   = '';
  document.getElementById('p3-stock').value = '0';
  document.getElementById('p3-error').textContent = '';
}

function p3_render() {
  const q   = (document.getElementById('p3-search').value || '').toLowerCase();
  const cat = document.getElementById('p3-filter-cat').value;
  const data = p3_db.filter(p => {
    const mq = !q   || p.name.toLowerCase().includes(q) || (p.brand||'').toLowerCase().includes(q);
    const mc = !cat || p.category === cat;
    return mq && mc;
  });
  document.getElementById('p3-count').textContent = p3_db.length;
  const tbody = document.getElementById('p3-tbody');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty">No products found.</div></td></tr>';
    return;
  }
  tbody.innerHTML = data.map((p, i) => {
    const varList = p.variants.map(v => {
      const c = v.stock === 0 ? '#ef4444' : v.stock < 10 ? '#d97706' : '#16a34a';
      return `<div class="variant-row"><b>${esc(v.sku)}</b> · ${esc(v.color||'—')}${v.size?' / '+esc(v.size):''} · Stock: <b style="color:${c}">${v.stock}</b></div>`;
    }).join('');
    return `<tr>
      <td style="color:#aaa;font-size:.72rem">${i+1}</td>
      <td><b>${esc(p.name)}</b><br><span style="font-size:.7rem;color:#888">${esc(p.description)}</span></td>
      <td><span class="chip chip-${p.category}">${p.category}</span></td>
      <td>${esc(p.brand)||'—'}</td>
      <td style="font-weight:700;color:#1a5fb4">₹${p.price.toLocaleString('en-IN')}</td>
      <td>${p.rating !== null ? '⭐ '+p.rating : '—'}</td>
      <td>${varList}</td>
      <td><span class="${p.inStock?'in-stock':'out-stock'}">${p.inStock?'✔ Yes':'✘ No'}</span></td>
      <td><button class="btn btn-red" onclick="p3_delete('${p._id}')">Delete</button></td>
    </tr>`;
  }).join('');
}

function p3_delete(id) {
  const p = p3_db.find(x => x._id === id);
  if (!p || !confirm('Delete "' + p.name + '"?')) return;
  p3_db = p3_db.filter(x => x._id !== id);
  p3_renderAll();
  toast('"' + p.name + '" deleted.', 'error');
}

function p3_renderStats() {
  const total    = p3_db.length;
  const inStock  = p3_db.filter(p => p.inStock).length;
  const outStock = p3_db.filter(p => !p.inStock).length;
  const variants = p3_db.reduce((s, p) => s + p.variants.length, 0);
  document.getElementById('p3-stats').innerHTML = `
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
    code: `Product.aggregate([\n  { $unwind: "$variants" },\n  { $group: {\n      _id: "$category",\n      totalStock: { $sum: "$variants.stock" },\n  }}\n])`,
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
    const low = p3_db.map(p => ({ ...p, variants: p.variants.filter(v => v.stock < 10) })).filter(p => p.variants.length);
    result = low.length
      ? low.map(p => `<div style="margin-bottom:8px"><div class="agg-label">● ${esc(p.name)}</div>` +
          p.variants.map(v => `<div><span class="agg-key">sku:</span> <span class="agg-val">"${esc(v.sku)}"</span> · <span class="agg-key">stock:</span> <span class="agg-warn">${v.stock}</span> ${v.stock===0?'⚠ OUT':'⚡ LOW'}</div>`).join('') + '</div>').join('')
      : '<span style="color:#888">No low-stock products.</span>';
  } else if (type === 'categoryRatings') {
    const cats = {};
    p3_db.forEach(p => {
      if (!cats[p.category]) cats[p.category] = { sum: 0, cnt: 0 };
      if (p.rating !== null) { cats[p.category].sum += p.rating; cats[p.category].cnt++; }
    });
    result = Object.entries(cats).map(([cat, d]) => {
      const avg = d.cnt > 0 ? (d.sum/d.cnt).toFixed(2) : 'null';
      return `<div><span class="agg-key">_id:</span> <span class="agg-val">"${cat}"</span> · <span class="agg-key">avgRating:</span> <span class="agg-num">${avg}</span> · <span class="agg-key">count:</span> <span class="agg-num">${d.cnt}</span></div>`;
    }).join('');
  } else if (type === 'stockSummary') {
    const cats = {};
    p3_db.forEach(p => {
      if (!cats[p.category]) cats[p.category] = 0;
      p.variants.forEach(v => { cats[p.category] += v.stock; });
    });
    result = Object.entries(cats).map(([cat, total]) =>
      `<div><span class="agg-key">_id:</span> <span class="agg-val">"${cat}"</span> · <span class="agg-key">totalStock:</span> <span class="agg-num">${total}</span></div>`
    ).join('');
  } else if (type === 'priceRange') {
    const cats = {};
    p3_db.forEach(p => {
      if (!cats[p.category]) cats[p.category] = [];
      cats[p.category].push(p.price);
    });
    result = Object.entries(cats).map(([cat, prices]) => {
      const min = Math.min(...prices), max = Math.max(...prices);
      const avg = Math.round(prices.reduce((a,b)=>a+b,0)/prices.length);
      return `<div><span class="agg-key">_id:</span> <span class="agg-val">"${cat}"</span> · <span class="agg-key">min:</span> <span class="agg-num">₹${min.toLocaleString('en-IN')}</span> · <span class="agg-key">max:</span> <span class="agg-num">₹${max.toLocaleString('en-IN')}</span> · <span class="agg-key">avg:</span> <span class="agg-num">₹${avg.toLocaleString('en-IN')}</span></div>`;
    }).join('');
  }
  document.getElementById('agg-output').innerHTML =
    `<div class="agg-label">Result:</div><div class="agg-result">${result}</div>`;
}

// STOCK MANAGEMENT
function p3_loadVariants() {
  const id  = document.getElementById('s3-product').value;
  const sel = document.getElementById('s3-variant');
  const p   = p3_db.find(x => x._id === id);
  sel.innerHTML = '<option value="">— Select Variant —</option>';
  if (!p) return;
  p.variants.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.sku;
    opt.textContent = v.sku + ' · ' + (v.color||'') + (v.size?' / '+v.size:'') + ' — Stock: ' + v.stock;
    sel.appendChild(opt);
  });
}

function p3_updateStock() {
  const id  = document.getElementById('s3-product').value;
  const sku = document.getElementById('s3-variant').value;
  const qty = parseInt(document.getElementById('s3-qty').value);
  if (!id)  return toast('Select a product.', 'error');
  if (!sku) return toast('Select a variant.', 'error');
  if (isNaN(qty) || qty < 0) return toast('Enter valid stock (≥ 0).', 'error');
  const p = p3_db.find(x => x._id === id);
  const v = p?.variants.find(x => x.sku === sku);
  if (!v) return;
  v.stock = qty;
  p3_preSave(p);
  p3_renderAll();
  document.getElementById('s3-qty').value = '';
  toast('Stock updated: ' + sku + ' → ' + qty + ' units', 'success');
}

function p3_renderStockTable() {
  const rows = [];
  p3_db.forEach(p => {
    p.variants.forEach(v => {
      const status = v.stock === 0 ? '⚠ Out of Stock' : v.stock < 10 ? '⚡ Low Stock' : '✔ OK';
      const color  = v.stock === 0 ? '#ef4444' : v.stock < 10 ? '#d97706' : '#16a34a';
      rows.push(`<tr>
        <td><b>${esc(p.name)}</b></td>
        <td style="font-family:monospace">${esc(v.sku)}</td>
        <td><span class="chip chip-${p.category}">${p.category}</span></td>
        <td>${esc(v.color||'—')}${v.size?' / '+esc(v.size):''}</td>
        <td style="font-weight:700;color:${color}">${v.stock}</td>
        <td style="color:${color};font-weight:600">${status}</td>
      </tr>`);
    });
  });
  document.getElementById('p3-stock-tbody').innerHTML = rows.join('') ||
    '<tr><td colspan="6"><div class="empty">No variants.</div></td></tr>';

  const sel = document.getElementById('s3-product');
  const cur = sel.value;
  sel.innerHTML = '<option value="">— Select Product —</option>' +
    p3_db.map(p => `<option value="${p._id}">${esc(p.name)}</option>`).join('');
  if (p3_db.find(p => p._id === cur)) sel.value = cur;
}

// TABS inside 5.3
function showTab(name) {
  ['products','schema','aggregation','stock'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === name ? '' : 'none';
  });
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    const names = ['products','schema','aggregation','stock'];
    btn.classList.toggle('active', names[i] === name);
  });
  if (name === 'stock') p3_renderStockTable();
}

function p3_renderAll() {
  p3_renderStats();
  p3_render();
  p3_renderStockTable();
}

// ══════════════════════════════════════
//  BOOT
// ══════════════════════════════════════
p1_render();
s_render();
p3_renderAll();
showExp(1);