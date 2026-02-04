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

export function generateQuotationStart(detections: DetectionResult[], libraryItems: any[] = []): QuotationItem[] {
  const items: QuotationItem[] = [];
  
  detections.forEach((det, index) => {
    // 1. Try to find a match in the library based on Label
    // This is a simple keyword matching logic. In real world, we might use embedding search.
    let matchedItem = null;

    if (det.label.includes('wall')) {
      matchedItem = libraryItems.find(i => i.category === '油漆工程' || i.name.includes('乳膠漆'));
    } else if (det.label.includes('sofa')) {
      matchedItem = libraryItems.find(i => i.name.includes('沙發'));
    } else if (det.label.includes('window')) {
      matchedItem = libraryItems.find(i => i.category === '窗簾工程' || i.name.includes('窗'));
    } else if (det.label.includes('cabinet')) {
      matchedItem = libraryItems.find(i => i.category === '系統櫃工程' || i.name.includes('櫃'));
    }

    if (matchedItem) {
      items.push({
        id: `gen-${index}`, 
        category: matchedItem.category,
        name: matchedItem.name,
        specification: matchedItem.spec || '標準規格',
        quantity: det.label === 'wall' ? 15 : 1, // Simple rule for quantity
        unit: matchedItem.unit,
        unitPrice: matchedItem.unitPrice,
        totalPrice: (det.label === 'wall' ? 15 : 1) * matchedItem.unitPrice
      });
    } else {
      // 2. Fallback to AI Estimate if no library item found
       items.push({
        id: `gen-${index}`, 
        category: '其他工程',
        name: `AI 偵測: ${det.label} (未對應資料庫)`,
        specification: '請確認規格',
        quantity: 1, 
        unit: '式',
        unitPrice: det.estimatedPrice || 0,
        totalPrice: det.estimatedPrice || 0
      });
    }
  });

  return items;
}
