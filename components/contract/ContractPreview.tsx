import { QuotationItem } from '@/lib/quotation-engine';
import styles from './ContractPreview.module.css';

interface ContractPreviewProps {
  project: {
    name: string;
    clientName: string;
    address: string;
    date: string;
  };
  items: QuotationItem[];
  totalAmount: number;
}

export default function ContractPreview({ project, items, totalAmount }: ContractPreviewProps) {
  return (
    <div className={styles.contractPage} id="contract-print-area">
      <div className={styles.header}>
        <div className={styles.brand}>L'Atelier Design</div>
        <h1>室內裝修工程合約書</h1>
        <div className={styles.meta}>
          <p>合約編號：CTR-2026-001</p>
          <p>日期：{project.date}</p>
        </div>
      </div>

      <div className={styles.parties}>
        <div className={styles.party}>
          <h4>甲方 (業主)</h4>
          <p>姓名：{project.clientName}</p>
          <p>工程地點：{project.address}</p>
        </div>
        <div className={styles.party}>
          <h4>乙方 (承攬人)</h4>
          <p>公司：L'Atelier Design Studio</p>
          <p>負責人：Scott H.</p>
          <p>地址：台北市信義區信義路五段 7 號</p>
        </div>
      </div>

      <div className={styles.terms}>
        <h3>第一條：工程範圍</h3>
        <p>本工程範圍詳如附件估價單，總價新台幣 <strong>${totalAmount.toLocaleString()}</strong> 元整。</p>
        
        <h3>第二條：工程期限</h3>
        <p>自民國 115 年 3 月 1 日起至 115 年 6 月 30 日止。</p>
        
        <h3>第三條：付款方式</h3>
        <p>1. 簽約金 (30%): ${(totalAmount * 0.3).toLocaleString()}</p>
        <p>2. 開工款 (30%): ${(totalAmount * 0.3).toLocaleString()}</p>
        <p>3. 木作完工 (30%): ${(totalAmount * 0.3).toLocaleString()}</p>
        <p>4. 驗收尾款 (10%): ${(totalAmount * 0.1).toLocaleString()}</p>
      </div>

      <div className={styles.appendix}>
        <h4>附件：詳細估價單</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>項目</th>
              <th>規格</th>
              <th className={styles.right}>數量</th>
              <th className={styles.right}>複價</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category} / {item.specification}</td>
                <td className={styles.right}>{item.quantity} {item.unit}</td>
                <td className={styles.right}>${item.totalPrice.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className={styles.right}><strong>總計 (Total)</strong></td>
              <td className={styles.right}><strong>${totalAmount.toLocaleString()}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={styles.signatures}>
        <div className={styles.signBlock}>
          <p>甲方簽章：</p>
          <div className={styles.signBox}></div>
        </div>
        <div className={styles.signBlock}>
          <p>乙方簽章：</p>
          <div className={styles.signBox}>
             <img src="/signature_stamp.png" alt="Company Stamp" style={{opacity: 0.1}}/>
          </div>
        </div>
      </div>
      
      <div className={styles.footer}>
        第 1 頁 / 共 1 頁
      </div>
    </div>
  );
}
