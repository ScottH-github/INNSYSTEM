import styles from './Clients.module.css';
import { Link } from '@/navigation';
import { prisma } from '@/lib/prisma';

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      _count: {
        select: { projects: true }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>客戶名單 (Clients)</h1>
          <p className={styles.subtitle}>管理您的客戶關係與設計偏好。</p>
        </div>
        <button className={styles.addBtn}>+ 新增客戶 (New Client)</button>
      </header>

      <div className={styles.grid}>
        {clients.length === 0 ? (
           <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '3rem'}}>No clients found.</div>
        ) : clients.map((client) => (
          <div key={client.id} className={styles.clientCard}>
            <div className={styles.cardMain}>
              <div className={styles.avatar}>
                {/* Use a placeholder or initial since we don't have avatar URL in DB yet */}
                <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '50%'}}>
                  {client.name.charAt(0)}
                </div>
              </div>
              <div className={styles.info}>
                <h3>{client.name}</h3>
                <span className={styles.projects}>進行中專案: {client._count.projects}</span>
              </div>
            </div>
            <div className={styles.tags}>
              {client.preferredStyle ? (
                <span className={styles.tag}>{client.preferredStyle}</span>
              ) : (
                <span className={styles.tag} style={{background: 'transparent', border: '1px dashed #ccc'}}>無風格偏好</span>
              )}
            </div>
            <div className={styles.actions}>
              <button className={styles.viewBtn}>客戶詳情</button>
              <button className={styles.startBtn}>快速立案</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
