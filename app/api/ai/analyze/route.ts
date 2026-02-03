import { NextResponse } from 'next/server';
import { testAnalyzeImage } from '@/lib/ai/nano-banana';

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
    const analysisResult = await testAnalyzeImage(file);

    // For local mock, convert to base64 to return to client for immediate display
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = file.type;
    analysisResult.imageUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
