
'use client';
import { useState } from 'react';
import styles from '../../Login.module.css';
import { useRouter } from 'next/navigation';

export default function ResetForm({ token }: { token: string }) {
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<'IDLE'|'LOADING'|'SUCCESS'|'ERROR'>('IDLE');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password })
        });
        
        if (res.ok) {
            setStatus('SUCCESS');
            setTimeout(() => router.push('/login'), 2000);
        } else {
            setStatus('ERROR');
        }
    };

    if (status === 'SUCCESS') {
        return (
            <div style={{ textAlign: 'center', color: 'green' }}>
                <p>Password updated successfully!</p>
                <p>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
           <div className={styles.group}>
             <label>New Password</label>
             <input 
               type="password" 
               value={password} 
               onChange={e => setPassword(e.target.value)} 
               required 
               minLength={6}
               className={styles.input}
             />
           </div>

           {status === 'ERROR' && <div className={styles.error}>Failed to reset password</div>}
           
           <button type="submit" disabled={status === 'LOADING'} className={styles.submitBtn}>
             {status === 'LOADING' ? 'Updating...' : 'Set New Password'}
           </button>
        </form>
    );
}
