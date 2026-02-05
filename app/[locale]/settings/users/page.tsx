
import { prisma } from "@/lib/prisma";
import styles from "./Users.module.css";
import UserActionButtons from './UserActionButtons';
import EditUserButton from './EditUserButton';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    // include: {
    //   _count: { select: { loginLogs: true } }
    // }
  });

  return (
    <div className={styles.container}>

// ...

        <div className={styles.header}>
            <div>
              <h1 className={styles.title}>人員管理 (User Management)</h1>
              <p className={styles.subtitle}>管理系統使用者與權限設定。</p>
            </div>
            <UserActionButtons />
        </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>姓名 (Name)</th>
              <th>Email</th>
              <th>登入方式 (Auth)</th>
              <th>角色 (Role)</th>
              <th>狀態 (Status)</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className={styles.userName}>
                  <div className={styles.avatar}>{user.name?.[0] || user.email[0]}</div>
                  <span>{user.name || '未命名'}</span>
                </td>
                <td>{user.email}</td>
                <td>
                  <div style={{display: 'flex', gap: '8px'}}>
                    {user.googleId && <span title="Google Linked">🔵 G</span>}
                    {user.passwordHash && <span title="Password Set">🔑 P</span>}
                    {!user.googleId && !user.passwordHash && <span style={{color: 'red'}}>⚠ Unset</span>}
                  </div>
                </td>
                <td>
                  <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase()]}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={user.status === 'ACTIVE' ? styles.active : styles.inactive}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <EditUserButton user={user as any} /> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
