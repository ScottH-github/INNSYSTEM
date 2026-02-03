import { handleGoogleLogin } from '@/lib/actions';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>L'</div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Please enter your details to sign in.</p>
        </div>
        
        <form className={styles.form} onClick={(e) => e.preventDefault()}>
          <div className={styles.inputField}>
            <label>Work Email</label>
            <input type="email" placeholder="email@company.com" />
          </div>
          <div className={styles.inputField}>
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          
          <div className={styles.options}>
            <label className={styles.checkbox}>
              <input type="checkbox" /> Remember for 30 days
            </label>
            <span className={styles.forgot}>Forgot password?</span>
          </div>

          <button className={styles.signInBtn}>Sign In</button>
        </form>

        <form action={handleGoogleLogin}>
          <button className={styles.googleBtn} type="submit">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-1 2.227-1.954 2.871v2.388h3.164c1.852-1.705 2.922-4.215 2.922-7.114z" fill="#4285f4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-3.23-2.5c-.886.591-2.01.942-3.164.942-2.43 0-4.484-1.637-5.216-3.834H.12v2.464C1.59 15.82 5.066 18 9 18z" fill="#34a853"/>
              <path d="M3.784 10.428c-.18-.54-.282-1.114-.282-1.705s.102-1.165.282-1.705V4.554H.12C-.444 5.705-.764 7.02-.764 8.423s.32 2.718.884 3.869l3.664-2.864z" fill="#fbbc05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.462.884 11.426 0 9 0 5.066 0 1.59 2.18.12 5.122l3.664 2.864c.732-2.197 2.786-3.834 5.216-3.834z" fill="#ea4335"/>
            </svg>
            Sign in with Google
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account? <span className={styles.signup}>Contact Admin</span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
