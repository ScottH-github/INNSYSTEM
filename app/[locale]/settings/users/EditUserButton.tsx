
'use client';
import { useState } from 'react';
import styles from './Users.module.css';

type User = {
    id: string;
    name: string | null;
    email: string;
    role: string;
    status: string;
};

export default function EditUserButton({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <>
            <button onClick={() => setIsOpen(true)} className={styles.editBtn}>編輯</button>
            {isOpen && <EditUserModal user={user} onClose={() => setIsOpen(false)} />}
        </>
    );
}

function EditUserModal({ user, onClose }: { user: User; onClose: () => void }) {
    const [form, setForm] = useState({ 
        name: user.name || '', 
        role: user.role,
        status: user.status
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch(`/api/users/${user.id}`, {
            method: 'PATCH',
            body: JSON.stringify(form)
        });
        setLoading(false);
        if (res.ok) {
            alert('User updated!');
            window.location.reload(); 
            onClose();
        } else {
            alert('Failed to update user');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        setLoading(true);
        const res = await fetch(`/api/users/${user.id}`, {
            method: 'DELETE'
        });
        setLoading(false);
        if (res.ok) {
            alert('User deleted!');
            window.location.reload(); 
            onClose();
        } else {
            alert('Failed to delete user: ' + (await res.text()));
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Edit User: {user.email}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>Name</label>
                    <input className={styles.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    
                    <label>Role</label>
                    <select className={styles.input} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                        <option value="STAFF">Staff</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    <label>Status</label>
                    <select className={styles.input} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>

                    <div className={styles.modalActions}>
                        <button type="button" onClick={handleDelete} className={styles.deleteBtn} style={{color: 'red', marginRight: 'auto'}}>Delete</button>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
