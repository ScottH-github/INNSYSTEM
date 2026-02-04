'use client';

import { useState, useEffect } from 'react';
import styles from './Library.module.css';

interface LibraryItem {
  id: string;
  category: string;
  name: string;
  spec: string;
  unit: string;
  unitPrice: number;
}

export default function ItemLibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [newItem, setNewItem] = useState({
    category: '木作工程',
    name: '',
    spec: '',
    unit: '式',
    unitPrice: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/library');
      const data = await res.json();
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      setShowModal(false);
      setNewItem({ category: '木作工程', name: '', spec: '', unit: '式', unitPrice: '' });
      fetchItems();
    } catch (err) {
      alert('Failed to create item');
    }
  };

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>工項單價資料庫 (Item Library)</h1>
          <p>管理系統預設的施工項目與單價，供 AI 自動估價使用。</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setShowModal(true)}>
          + 新增工項
        </button>
      </header>

      {isLoading ? (
        <div className={styles.loading}>載入中...</div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>類別</th>
                  <th>項目名稱</th>
                  <th>規格說明</th>
                  <th>單位</th>
                  <th className={styles.right}>單價</th>
                  <th className={styles.right}>操作</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td><span className={styles.badge}>{item.category}</span></td>
                    <td className={styles.fw500}>{item.name}</td>
                    <td className={styles.muted}>{item.spec || '-'}</td>
                    <td>{item.unit}</td>
                    <td className={styles.right}>${item.unitPrice.toLocaleString()}</td>
                    <td className={styles.right}>
                      <button className={styles.iconBtn}>✎</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                   <tr><td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>目前沒有資料</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>新增工項</h2>
            <form onSubmit={handleCreate}>
              <div className={styles.formGroup}>
                <label>類別 (Category)</label>
                <select 
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  <option>拆除工程</option>
                  <option>泥作工程</option>
                  <option>水電工程</option>
                  <option>木作工程</option>
                  <option>油漆工程</option>
                  <option>系統櫃工程</option>
                  <option>其他工程</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>項目名稱 (Name)</label>
                <input required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="例如：全室平釘天花板" />
              </div>
              <div className={styles.formGroup}>
                <label>規格說明 (Spec)</label>
                <input value={newItem.spec} onChange={e => setNewItem({...newItem, spec: e.target.value})} placeholder="例如：日本矽酸鈣板, 永新角材" />
              </div>
              <div className={styles.row}>
                 <div className={styles.formGroup}>
                    <label>單位 (Unit)</label>
                    <input required value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} style={{width: '80px'}} />
                 </div>
                 <div className={styles.formGroup} style={{flex: 1}}>
                    <label>單價 (Price)</label>
                    <input required type="number" value={newItem.unitPrice} onChange={e => setNewItem({...newItem, unitPrice: e.target.value})} />
                 </div>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setShowModal(false)}>取消</button>
                <button type="submit" className={styles.primaryBtn}>儲存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
