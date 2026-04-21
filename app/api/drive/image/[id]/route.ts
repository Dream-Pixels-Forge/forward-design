/**
 * GET /api/drive/image/[id]
 * 
 * Gets metadata and content for a specific image by ID
 */

import { NextResponse } from 'next/server';
import { getFileById, downloadFileContent } from '@/lib/drive/client';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Get file metadata
    const file = await getFileById(id);

    if (!file) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Check if it's an image
    if (!file.mimeType?.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File is not an image' },
        { status: 400 }
      );
    }

    // Get the content as base64
    const base64Content = await downloadFileContent(id);

    return NextResponse.json({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      thumbnailLink: file.thumbnailLink,
      webViewLink: file.webViewLink,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      // Base64 content for direct embedding (use carefully for large images)
      data: `data:${file.mimeType};base64,${base64Content}`,
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to fetch image';
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}