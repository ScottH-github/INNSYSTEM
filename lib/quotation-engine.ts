import { DetectionResult } from '@/lib/ai/nano-banana';

export interface QuotationItem {
  id: string;
  category: string;
  name: string;
  specification: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export function generateQuotationStart(detections: DetectionResult[]): QuotationItem[] {
  const items: QuotationItem[] = [];
  
  // Group by label to avoid duplicate separate items for things like multiple windows
  // For furniture, we might want individual items.
  
  detections.forEach((det, index) => {
    switch (det.label) {
      case 'wall':
        items.push({
          id: `gen-${index}`, 
          category: '油漆工程',
          name: '全室乳膠漆 (得利)',
          specification: '批土研磨, 二底三度',
          quantity: 12, // Mock area logic
          unit: '坪',
          unitPrice: 1350,
          totalPrice: 12 * 1350
        });
        break;
      case 'sofa':
        items.push({
          id: `gen-${index}`, 
          category: '家具工程',
          name: '訂製 L 型沙發',
          specification: '貓抓布, 高密度泡棉',
          quantity: 1, 
          unit: '組',
          unitPrice: 45000,
          totalPrice: 45000
        });
        break;
      case 'window':
        items.push({
          id: `gen-${index}`, 
          category: '窗簾工程',
          name: '調光捲簾',
          specification: '半遮光材質',
          quantity: 1, 
          unit: '窗',
          unitPrice: 3500,
          totalPrice: 3500
        });
        break;
      // Add more rules...
      default: 
        if (det.estimatedPrice) {
           items.push({
            id: `gen-${index}`, 
            category: '其他工程',
            name: `AI 偵測項目: ${det.label}`,
            specification: '待確認規格',
            quantity: 1, 
            unit: '式',
            unitPrice: det.estimatedPrice,
            totalPrice: det.estimatedPrice
          });
        }
    }
  });

  return items;
}
