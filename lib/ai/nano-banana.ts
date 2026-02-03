export type DetectionLabel = 'wall' | 'window' | 'door' | 'sofa' | 'table' | 'chair' | 'cabinet' | 'bed';

export interface BoundingBox {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
}

export interface DetectionResult {
  id: string;
  label: DetectionLabel;
  confidence: number;
  box: BoundingBox;
  estimatedPrice?: number;
}

export interface AnalyzeResponse {
  imageUrl: string; // The URL of the uploaded/processed image
  detections: DetectionResult[];
  summary: {
    totalArea?: number; // Estimated area in ping
    roomType?: string; // e.g. "Living Room"
  }
}

/**
 * MOCK: Simulates sending an image to the Nano Banana AI model.
 * In a real scenario, this would POST the image binary to an external inference server.
 */
export async function testAnalyzeImage(file: File): Promise<AnalyzeResponse> {
  // Simulate network latency (1.5s - 3s)
  const delay = Math.random() * 1500 + 1500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Generate some deterministic-looking random detections
  // In reality, these would be coordinates returned by the model based on pixel features.
  
  const mockDetections: DetectionResult[] = [
    {
      id: 'd1', label: 'window', confidence: 0.98,
      box: { x: 10, y: 5, width: 20, height: 5 },
      estimatedPrice: 12000
    },
    {
      id: 'd2', label: 'window', confidence: 0.95,
      box: { x: 70, y: 5, width: 20, height: 5 },
      estimatedPrice: 12000
    },
    {
      id: 'd3', label: 'sofa', confidence: 0.88,
      box: { x: 35, y: 40, width: 30, height: 15 },
      estimatedPrice: 45000
    },
    {
      id: 'd4', label: 'table', confidence: 0.92,
      box: { x: 40, y: 60, width: 20, height: 20 },
      estimatedPrice: 8500
    },
    {
      id: 'd5', label: 'cabinet', confidence: 0.85,
      box: { x: 5, y: 30, width: 15, height: 40 },
      estimatedPrice: 32000
    }
  ];

  return {
    imageUrl: '', // This will be filled by the API route handler with the actual file path/url
    detections: mockDetections,
    summary: {
      totalArea: 12.5,
      roomType: 'Living Room'
    }
  };
}
