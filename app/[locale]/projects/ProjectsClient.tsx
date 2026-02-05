
'use client';

import { useState } from 'react';
import { useRouter } from '@/navigation';
import styles from './Projects.module.css';

interface Project {
  id: string;
  name: string;
  client: { name: string };
  status: string;
  area: number | null;
  updatedAt: Date | string;
  budget: number | null;
}

interface Props {
  initialProjects: Project[];
}

export default function ProjectsClient({ initialProjects }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    area: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newProject = await res.json();
        setShowModal(false);
        router.push(`/projects/${newProject.id}`);
        router.refresh();
      } else {
        alert('Failed to create project');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>專案列表 (Projects)</h1>
          <p className={styles.subtitle}>管理與追蹤您的室內設計案。</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          + 新增專案 (New Project)
        </button>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>專案名稱</th>
              <th>客戶</th>
              <th>狀態</th>
              <th>坪數</th>
              <th>最後更新</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {initialProjects.length === 0 ? (
              <tr>
                <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                  尚無專案。請點擊右上角新增。
                </td>
              </tr>
            ) : initialProjects.map((p) => (
              <tr key={p.id}>
                <td className={styles.projectName}>
                  <div style={{cursor: 'pointer', color: 'var(--accent-rose)'}} onClick={() => router.push(`/projects/${p.id}`)}>
                    {p.name}
                  </div>
                </td>
                <td>{p.client.name}</td>
                <td>
                  <span className={`${styles.badge} ${p.status === 'DESIGNING' ? styles.designing : styles.other}`}>
                    {p.status}
                  </span>
                </td>
                <td>{p.area} 坪</td>
                <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => router.push(`/projects/${p.id}`)} className={styles.viewLink}>
                    查看詳情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>新增專案</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>專案名稱</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. 信義區林公館"
                />
              </div>
              <div className={styles.formGroup}>
                <label>客戶姓名</label>
                <input 
                  required
                  value={formData.clientName}
                  onChange={e => setFormData({...formData, clientName: e.target.value})}
                  placeholder="e.g. 林先生"
                />
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>坪數</label>
                  <input 
                    type="number"
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>預算 (萬)</label>
                  <input 
                    type="number"
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
              </div>
              <div className={styles.actions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.secondaryBtn}>取消</button>
                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                  {loading ? '建立中...' : '建立專案'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
