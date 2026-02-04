import OpenAI from 'openai';
import { DetectionResult } from './nano-banana';

// Initialize OpenAI Client
// 注意：在生產環境中，API Key 應存儲於環境變數 OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder', // 暫時 fallback，避免 build error
  dangerouslyAllowBrowser: true // 僅用於 Demo，正常應在 Server Side 呼叫
});

/**
 * 透過 GPT-4o 分析平面圖
 */
export async function analyzeImageWithGPT4(base64Image: string): Promise<DetectionResult[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `你是一個專業的室內設計估價師。請分析這張平面圖，並找出所有可計價的物件。
          
          請回傳一個 JSON 陣列，每個物件包含：
          - label: 物件名稱 (英文，如 "window", "door", "sofa", "bed", "cabinet")
          - confidence: 信心分數 (0-1)
          - estimatedPrice: 預估單價 (台幣)
          - box: 邊框位置 (x, y, width, height) 都是百分比 (0-100)
          
          請針對以下項目重點偵測：
          1. Window (窗戶 -> 窗簾工程)
          2. Door (門 -> 門窗工程)
          3. Sofa (沙發 -> 家具工程)
          4. Bed (床 -> 家具工程)
          5. Wardrobe (衣櫃 -> 系統櫃工程)
          6. Table (桌子 -> 家具工程)
          
          回傳格式範例：
          [
            { "label": "window", "confidence": 0.95, "estimatedPrice": 3500, "box": { "x": 10, "y": 20, "width": 15, "height": 5 } }
          ]`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "請分析這張平面圖：" },
            {
              type: "image_url",
              image_url: {
                "url": base64Image,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" }, // 強制 JSON 模式
    });

    const content = response.choices[0].message.content;
    if (!content) return [];

    const parsed = JSON.parse(content);
    // 兼容 GPT 可能回傳 { items: [] } 或直接 []
    const results = Array.isArray(parsed) ? parsed : (parsed.items || parsed.detections || []);
    
    // 補上 ID
    return results.map((item: any, index: number) => ({
      ...item,
      id: `gpt-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("OpenAI Analysis Error:", error);
    return [];
  }
}
