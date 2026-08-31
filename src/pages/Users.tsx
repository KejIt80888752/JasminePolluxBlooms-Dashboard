import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface UserRow { id:number; name:string; email:string; role:string; lastLogin:string; status:string; }

const INITIAL_USERS: UserRow[] = [
  { id: 1, name: 'Jasmine', email: 'jasminepolluxblooms@gmail.com', role: 'Admin', lastLogin: '—', status: 'Active' },
];

const roleBadge: Record<string, string> = {
  Admin: 'badge badge-red',
  Manager: 'badge badge-blue',
  Florist: 'badge badge-green',
  Accounts: 'badge badge-orange',
  Viewer: 'badge badge-gray',
};

const statusBadge: Record<string, string> = {
  Active: 'badge badge-green',
  Inactive: 'badge badge-gray',
};

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', status: 'Active' });

  const activeCount = users.filter(u=>u.status==='Active').length;
  const adminCount = users.filter(u=>u.role==='Admin').length;

  const handleAdd = () => {
    if (!form.name || !form.email || !form.role) { alert('Enter Name, Email and Role'); return; }
    setUsers(prev => [...prev, { id: Date.now(), name: form.name, email: form.email, role: form.role, lastLogin: '—', status: form.status || 'Active' }]);
    setModalOpen(false); setForm({ name:'', email:'', phone:'', role:'', status:'Active' });
  };

  const handleDelete = (u: UserRow) => {
    if (confirm(`Remove user "${u.name}"?`)) setUsers(prev => prev.filter(x => x.id !== u.id));
  };

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Users</h2>
        <p style={{ color: 'var(--muted)', margin: '4px 0 0' }}>Manage staff accounts and access roles.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <div className="stat-card">
          <div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fce7f3' }}>
            <i className="fa fa-users" style={{ color: '#be185d', fontSize: 22 }} />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Total Users</div>
            <div className="text-xl font-bold text-gray-800 mt-0.5">{users.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">System accounts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#dcfce7' }}>
            <i className="fa fa-user-check" style={{ color: '#16a34a', fontSize: 22 }} />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Active</div>
            <div className="text-xl font-bold text-gray-800 mt-0.5">{activeCount}</div>
            <div className="text-xs text-gray-400 mt-0.5">Currently active</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fee2e2' }}>
            <i className="fa fa-user-shield" style={{ color: '#dc2626', fontSize: 22 }} />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Admin</div>
            <div className="text-xl font-bold text-gray-800 mt-0.5">{adminCount}</div>
            <div className="text-xs text-gray-400 mt-0.5">Full access</div>
          </div>
        </div>
      </div>

      <div className="card p-5 mb-5">
        <div className="filter-bar">
          <button className="btn-brand" onClick={() => setModalOpen(true)}>
            <i className="fa fa-plus" /> Add User
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="section-title text-sm flex items-center gap-2">System Users</span>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>{users.length} users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#be185d', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {r.name.charAt(0)}
                      </div>
                      <strong>{r.name}</strong>
                    </div>
                  </td>
                  <td>{r.email}</td>
                  <td><span className={roleBadge[r.role] ?? 'badge badge-gray'}>{r.role}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{r.lastLogin}</td>
                  <td><span className={statusBadge[r.status]}>{r.status}</span></td>
                  <td>
                    <button className="btn-outline btn-sm" style={{display:'inline-flex',alignItems:'center',gap:3}}><Edit2 size={11}/>Edit</button>{' '}
                    <button className="btn-outline btn-sm" style={{display:'inline-flex',alignItems:'center',gap:3,color:'#ef4444'}} onClick={()=>handleDelete(r)}><Trash2 size={11}/>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">Add User</span>
              <button className="text-gray-400 hover:text-gray-700 cursor-pointer text-lg p-1" onClick={() => setModalOpen(false)}><i className="fa fa-times" /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Full Name</label>
                  <input className="inp" placeholder="Enter full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Email</label>
                  <input className="inp" type="email" placeholder="Enter email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Phone</label>
                  <input className="inp" placeholder="Enter phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-field">
                  <label className="form-label">Role</label>
                  <select className="sel" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="">Select role</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Florist</option>
                    <option>Accounts</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Status</label>
                <select className="sel" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-brand" onClick={handleAdd}>Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
