
import styles from '../../Login.module.css';
import ResetForm from './ResetForm';
import { validateResetToken } from '@/lib/auth-actions';

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams;
  const validation = await validateResetToken(token);

  if (!validation.valid) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Error</h1>
            <p className={styles.subtitle} style={{ color: 'red' }}>{validation.error}</p>
          </div>
        </div>
      );
  }

  return (
    <div className={styles.container}>
       <div className={styles.card}>
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>Set a new password for {validation.email}</p>
          <ResetForm token={token} />
       </div>
    </div>
  );
}
