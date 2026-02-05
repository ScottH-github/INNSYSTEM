
'use client';
import { useState } from 'react';
import { handleGoogleLogin } from '@/lib/actions';
import styles from './Login.module.css';
import {Link} from '@/navigation';

// We need a server action for credentials login too, or use signIn directly in client?
// NextAuth v5 client `signIn` is best for credentials to handle redirect.
// But server action `handleCredentialLogin` is more consistent.
// Let's stick to client-side signIn for Credentials to easier handle errors?
// Actually, server action is the V5 way. I will add handleCredentialLogin to actions.

// Wait, standard V5 practice: Credentials login form acts as server action?
// Or we can use `signIn` imported from `next-auth/react`?
// Let's use `signIn` client side for simplicity.
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
      console.log('SignIn result', res);
      // NextAuth v5 res is undefined on success? Or returns object?
      if (res?.error) {
        setError('Invalid credentials');
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to INNSPACE OS</p>

        <form onSubmit={handleLogin} className={styles.form}>
           <div className={styles.group}>
             <label>Email</label>
             <input 
               type="email" 
               value={email} 
               onChange={e => setEmail(e.target.value)} 
               required 
               className={styles.input}
               placeholder="name@company.com"
             />
             <small className={styles.hint}>Please use a valid email address format.</small>
           </div>
           
           <div className={styles.group}>
             <label>Password</label>
             <input 
               type="password" 
               value={password} 
               onChange={e => setPassword(e.target.value)} 
               required 
               className={styles.input}
               placeholder="At least 6 characters"
             />
             <small className={styles.hint}>Password must be at least 6 characters.</small>
           </div>

           {error && <div className={styles.error}>{error}</div>}

           <div className={styles.actions}>
             <button type="button" onClick={() => { setEmail(''); setPassword(''); setError(''); }} className={styles.cancelBtn}>
               Cancel
             </button>
             <button type="submit" className={styles.submitBtn}>
               Sign In with Password
             </button>
           </div>
        </form>
        
        <div className={styles.divider}>OR</div>

        <form action={handleGoogleLogin}>
          <button type="submit" className={styles.googleBtn}>
             Sign In with Google
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/login/forgot" className={styles.link}>Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}
