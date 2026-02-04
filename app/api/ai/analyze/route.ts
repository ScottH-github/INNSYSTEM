import { NextResponse } from 'next/server';
import { testAnalyzeImage } from '@/lib/ai/nano-banana';
import { analyzeImageWithGPT4 } from '@/lib/ai/openai-service';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // In a real app, upload file to S3/Cloudinary here.
    // For local dev, we just pretend.
    
    // Call the AI Service
    // Convert to Base64 for OpenAI API
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = file.type;
    const base64Image = `data:${mimeType};base64,${base64}`;
    
    // Call the Real AI Service (fallback to mock if no detections or error)
    // Note: We're doing a hybrid approach to safe costs or fallback
    let detections = await analyzeImageWithGPT4(base64Image);
    
    // Fallback logic if OpenAI returns empty (e.g. no API Key)
    if (detections.length === 0) {
       console.log("GPT-4o returned no results, falling back to mock.");
       const mockRes = await testAnalyzeImage(file);
       detections = mockRes.detections;
    }

    const analysisResult = {
      imageUrl: base64Image,
      detections: detections,
      summary: { totalArea: 0, roomType: 'Unknown' } // GPT currently doesn't return summary, can prompt for it later
    };

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
