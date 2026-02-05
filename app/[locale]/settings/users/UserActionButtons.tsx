
'use client';
import { useState } from 'react';
import styles from './Users.module.css';

export default function UserActionButtons() {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <>
            <button onClick={() => setIsOpen(true)} className={styles.addBtn}>+ 新增人員 (Invite User)</button>
            {isOpen && <AddUserModal onClose={() => setIsOpen(false)} />}
        </>
    );
}

function AddUserModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STAFF' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(form)
        });
        setLoading(false);
        if (res.ok) {
            alert('User created!');
            window.location.reload(); // Simple refresh for MVP
            onClose();
        } else {
            alert('Failed to create user');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Add New User</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>Name</label>
                    <input className={styles.input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    
                    <label>Email</label>
                    <input className={styles.input} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />

                    <label>Password (Optional)</label>
                    <input className={styles.input} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} minLength={6} placeholder="Leave empty for Google Login only" />
                    
                    <label>Role</label>
                    <select className={styles.input} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                        <option value="STAFF">Staff</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
