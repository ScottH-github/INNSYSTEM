
'use client';
import { useState } from 'react';
import styles from '../Login.module.css'; // Reuse styles
import {Link} from '@/navigation';

export default function ForgotPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE'|'LOADING'|'SUCCESS'|'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');
    const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
    });
    if (res.ok) {
        setStatus('SUCCESS');
    } else {
        setStatus('ERROR');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot Password?</h1>
        <p className={styles.subtitle}>Enter your email to reset instructions.</p>

        {status === 'SUCCESS' ? (
             <div style={{ textAlign: 'center', color: 'green' }}>
                 <p>Reset link has been sent to your email!</p>
                 <br/>
                 <Link href="/login" className={styles.link}>Back to Login</Link>
             </div>
        ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
               <div className={styles.group}>
                 <label>Email</label>
                 <input 
                   type="email" 
                   value={email} 
                   onChange={e => setEmail(e.target.value)} 
                   required 
                   className={styles.input}
                 />
               </div>
               
               {status === 'ERROR' && <div className={styles.error}>Failed to request reset</div>}

               <button type="submit" disabled={status === 'LOADING'} className={styles.submitBtn}>
                 {status === 'LOADING' ? 'Sending...' : 'Send Reset Link'}
               </button>
               
               <div className={styles.footer}>
                  <Link href="/login" className={styles.link}>Back to Login</Link>
               </div>
            </form>
        )}
      </div>
    </div>
  );
}
