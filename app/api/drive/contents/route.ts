/**
 * GET /api/drive/contents
 * 
 * Lists all files in the configured Google Drive folder
 * Includes caching with 24-hour TTL
 * Supports caption parsing from texte.md / texte.txt files
 */

import { NextResponse } from 'next/server';
import { 
  getDriveClient, 
  getFolderId, 
  parseCaptionFile,
  getCaptionForImage,
  findCaptionFile,
} from '@/lib/drive/client';

// Cache configuration
const CACHE_TTL = 86400; // 24 hours in seconds

export const runtime = 'edge';

export async function GET() {
  try {
    const drive = getDriveClient();
    const folderId = getFolderId();

    // Fetch all files in the folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, thumbnailLink, webContentLink, webViewLink, createdTime, modifiedTime)',
      orderBy: 'name',
      pageSize: 100,
    });

    const files: { id?: string; name?: string; mimeType?: string; thumbnailLink?: string; webViewLink?: string; createdTime?: string; modifiedTime?: string }[] = response.data.files || [];

    // Find and parse caption file if it exists
    const captionFile = await findCaptionFile(folderId);
    const captionMap = captionFile 
      ? parseCaptionFile(captionFile.content) 
      : new Map();

    // Filter and map only image files with their metadata and captions
    const images = files
      .filter((file) => {
        const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
        return file.mimeType ? imageMimeTypes.includes(file.mimeType) : false;
      })
      .map((file) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        thumbnailLink: file.thumbnailLink,
        webViewLink: file.webViewLink,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        // Add caption if available
        caption: file.name ? getCaptionForImage(file.name, captionMap) : null,
      }));

    // Create response with caching headers
    const nextResponse = NextResponse.json({
      folderId,
      count: images.length,
      images,
      // Include caption file info if present
      captionFile: captionFile ? { name: captionFile.name } : null,
    });

    // Set cache headers for 24-hour TTL
    nextResponse.headers.set('Cache-Control', `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}, stale-while-revalidate`);

    return nextResponse;
  } catch (error) {
    console.error('Error fetching drive contents:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to fetch drive contents';
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}