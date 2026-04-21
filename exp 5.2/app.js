let students = JSON.parse(localStorage.getItem('sms_students') || '[]');
let editingId = null;
if (students.length === 0) {
  students = [
    { id: 1, name: 'Michael Johnson', roll: 1, grade: 'A', email: 'michael@school.edu' },
    { id: 2, name: 'Emma Williams',   roll: 2, grade: 'B', email: 'emma@school.edu'   },
    { id: 3, name: 'Liam Anderson',   roll: 3, grade: 'A', email: 'liam@school.edu'   },
  ];
  save();
}
function save() {
  localStorage.setItem('sms_students', JSON.stringify(students));
}
function render(list) {
  list = list || students;
  document.getElementById('count-label').textContent = list.length + ' students enrolled';
  const container = document.getElementById('student-list');
  if (!list.length) {
    container.innerHTML = '<div class="empty"><p>No students found.</p></div>';
    return;
  }
  container.innerHTML = [...list]
    .sort((a, b) => a.roll - b.roll)
    .map(s => `
      <div class="card">
        <div class="card-body">
          <div class="student-name">${esc(s.name)}</div>
          <div class="student-roll">Roll: ${s.roll}</div>
          ${s.grade ? `<div class="student-grade">Grade: <span class="grade-badge grade-${s.grade.toLowerCase()}">${s.grade}</span></div>` : ''}
          ${s.email ? `<div class="student-email">${esc(s.email)}</div>` : ''}
        </div>
        <hr class="card-divider">
        <div class="card-actions">
          <button class="btn-edit"   onclick="openEditModal(${s.id})">Edit</button>
          <button class="btn-delete" onclick="deleteStudent(${s.id})">Delete</button>
        </div>
      </div>
    `).join('');
}
function submitForm() {
  const name  = document.getElementById('f-name').value.trim();
  const roll  = Number(document.getElementById('f-roll').value);
  const grade = document.getElementById('f-grade').value;
  const email = document.getElementById('f-email').value.trim();
  const errEl = document.getElementById('form-error');

  if (!name)  { errEl.textContent = 'Full name is required.'; return; }
  if (!roll)  { errEl.textContent = 'Roll number is required.'; return; }
  if (students.some(s => s.roll === roll && s.id !== editingId)) {
    errEl.textContent = `Roll number ${roll} is already taken.`; return;
  }
  errEl.textContent = '';
  if (editingId) {
    const idx = students.findIndex(s => s.id === editingId);
    students[idx] = { id: editingId, name, roll, grade, email };
    toast('Student updated.');
  } else {
    students.push({ id: Date.now(), name, roll, grade, email });
    toast('Student added.');
  }
  save();
  closeModal();
  render();
}
function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  const s = students.find(x => x.id === id);
  students = students.filter(x => x.id !== id);
  save();
  render();
  toast(s.name + ' removed.');
}
function openAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = 'New Student';
  document.querySelector('.btn-save').textContent = 'Add Student';
  document.getElementById('f-name').value  = '';
  document.getElementById('f-roll').value  = '';
  document.getElementById('f-grade').value = '';
  document.getElementById('f-email').value = '';
  document.getElementById('form-error').textContent = '';
  document.getElementById('modal').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}
function openEditModal(id) {
  const s = students.find(x => x.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById('modal-title').textContent = 'Edit Student';
  document.querySelector('.btn-save').textContent = 'Save Changes';
  document.getElementById('f-name').value  = s.name;
  document.getElementById('f-roll').value  = s.roll;
  document.getElementById('f-grade').value = s.grade;
  document.getElementById('f-email').value = s.email;
  document.getElementById('form-error').textContent = '';
  document.getElementById('modal').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}
document.getElementById('search').addEventListener('input', function () {
  const q = this.value.trim().toLowerCase();
  const filtered = q
    ? students.filter(s =>
        s.name.toLowerCase().includes(q) ||
        String(s.roll).includes(q) ||
        (s.email || '').toLowerCase().includes(q))
    : students;
  render(filtered);
});
let toastTimer;
function toast(msg) {
  clearTimeout(toastTimer);
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}
function esc(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
render();