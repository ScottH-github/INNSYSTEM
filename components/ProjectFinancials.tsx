
'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import styles from './ProjectFinancials.module.css';

interface FinanceRecord {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description: string;
}

interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;
}

interface Props {
  projectId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ProjectFinancials({ projectId }: Props) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newRecord, setNewRecord] = useState({
    type: 'EXPENSE',
    category: 'Material',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    invoiceNo: ''
  });

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/finance?projectId=${projectId}`);
      const data = await res.json();
      setSummary(data.summary);
      setRecords(data.records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newRecord, projectId })
    });
    setShowAddModal(false);
    fetchData();
  };

  if (loading) return <div>Loading Financial Data...</div>;

  const pieData = [
    { name: 'Income', value: summary?.totalIncome || 0 },
    { name: 'Expense', value: summary?.totalExpense || 0 },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3>專案財務概況 (Financials)</h3>
        <button onClick={() => setShowAddModal(true)} className={styles.primaryBtn}>
          + 新增收支記錄
        </button>
      </header>

      {/* KPI Cards */}
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span>總收入 (Revenue)</span>
          <h2 className={styles.income}>${summary?.totalIncome.toLocaleString()}</h2>
        </div>
        <div className={styles.kpiCard}>
          <span>總支出 (Cost)</span>
          <h2 className={styles.expense}>${summary?.totalExpense.toLocaleString()}</h2>
        </div>
        <div className={styles.kpiCard}>
          <span>淨利 (Net Profit)</span>
          <h2 style={{color: (summary?.netProfit || 0) >= 0 ? '#4caf50' : '#f44336'}}>
            ${summary?.netProfit.toLocaleString()}
          </h2>
        </div>
        <div className={styles.kpiCard}>
          <span>毛利率 (Margin)</span>
          <h2>{summary?.profitMargin.toFixed(1)}%</h2>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsRow}>
        <div className={styles.chartContainer}>
          <h4>收支對比 (Income vs Expense)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: 'Financials', Income: summary?.totalIncome, Expense: summary?.totalExpense }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="Income" fill="#4caf50" />
              <Bar dataKey="Expense" fill="#f44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.chartContainer}>
          <h4>成本分佈 (Cost Distribution)</h4>
           <div style={{height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888'}}>
             {/* Simplified for now, real app would aggregate categories */}
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4caf50' : '#f44336'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className={styles.tableContainer}>
        <h4>近期交易紀錄 (Transaction History)</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>日期</th>
              <th>類型</th>
              <th>類別</th>
              <th>說明</th>
              <th align="right">金額</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>
                  <span className={r.type === 'INCOME' ? styles.tagIncome : styles.tagExpense}>
                    {r.type}
                  </span>
                </td>
                <td>{r.category}</td>
                <td>{r.description}</td>
                <td align="right">${r.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>新增收支記錄</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>類型 (Type)</label>
                <select 
                  value={newRecord.type} 
                  onChange={e => setNewRecord({...newRecord, type: e.target.value})}
                >
                  <option value="INCOME">收入 (Income)</option>
                  <option value="EXPENSE">支出 (Expense)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>類別 (Category)</label>
                <input 
                  type="text" 
                  placeholder="例如: 設計費, 拆除工程, 第一期款"
                  value={newRecord.category} 
                  onChange={e => setNewRecord({...newRecord, category: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>金額 (Amount)</label>
                <input 
                  type="number" 
                  value={newRecord.amount} 
                  onChange={e => setNewRecord({...newRecord, amount: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>日期 (Date)</label>
                <input 
                  type="date" 
                  value={newRecord.date} 
                  onChange={e => setNewRecord({...newRecord, date: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>說明 (Description)</label>
                <input 
                  type="text" 
                  value={newRecord.description} 
                  onChange={e => setNewRecord({...newRecord, description: e.target.value})}
                />
              </div>
              <div className={styles.actions}>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.secondaryBtn}>取消</button>
                <button type="submit" className={styles.primaryBtn}>儲存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
