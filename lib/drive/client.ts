/**
 * Google Drive Client - Service Account Authentication
 * 
 * Required environment variables:
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL: The service account email address
 * - GOOGLE_PRIVATE_KEY: The private key (multiline, replace \n with actual newlines)
 * - GOOGLE_DRIVE_FOLDER_ID: The ID of the folder to access
 * 
 * Setup instructions:
 * 1. Create a project at https://console.cloud.google.com/
 * 2. Enable Google Drive API
 * 3. Create a Service Account and download JSON credentials
 * 4. Share your portfolio folder with the service account email
 * 5. Copy values to .env.local
 */

// Type for file from Google Drive API
export interface DriveFile {
  id?: string;
  name?: string;
  mimeType?: string;
  thumbnailLink?: string;
  webContentLink?: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
}

// Type for caption mapping
export type CaptionMap = Map<string, string>;

/**
 * Image file with additional metadata
 */
export interface ImageFile {
  id: string;
  name: string;
  mimeType: string | null;
  thumbnailLink: string | null;
  webViewLink: string | null;
  createdTime: string | null;
  modifiedTime: string | null;
  caption?: string | null;
}

// Google APIs - these will be populated at runtime if googleapis is installed
declare const google: {
  auth: {
    GoogleAuth: new (options: {
      credentials?: { client_email?: string; private_key?: string };
      scopes?: string[];
    }) => {
      getClient(): unknown;
    };
  };
  drive: (options: { version: string; auth: unknown }) => {
    files: {
      list(options?: {
        q?: string;
        fields?: string;
        orderBy?: string;
        pageSize?: number;
      }): Promise<{ data: { files: DriveFile[] } }>;
      get(options: {
        fileId: string;
        fields?: string;
        alt?: string;
      }): Promise<{ data: DriveFile }>;
    };
  };
};

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

/**
 * Get the Google Drive instance with Service Account authentication
 */
export function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Get the configured folder ID from environment
 */
export function getFolderId(): string {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');
  }
  return folderId;
}

/**
 * List files in a specific folder
 */
export async function listFolderContents(folderId?: string): Promise<DriveFile[]> {
  const drive = getDriveClient();
  const targetFolderId = folderId || getFolderId();

  const response = await drive.files.list({
    q: `'${targetFolderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType, thumbnailLink, webContentLink, webViewLink, createdTime, modifiedTime)',
    orderBy: 'name',
    pageSize: 100,
  });

  return response.data.files || [];
}

/**
 * Get a specific file by ID
 */
export async function getFileById(fileId: string): Promise<DriveFile> {
  const drive = getDriveClient();

  const response = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, thumbnailLink, webContentLink, webViewLink, createdTime, modifiedTime',
  });

  return response.data;
}

/**
 * Download file content as base64
 */
export async function downloadFileContent(fileId: string): Promise<string> {
  const drive = getDriveClient();

  const response = await drive.files.get({
    fileId,
    alt: 'media',
  }) as unknown as { data: ArrayBuffer };

  const buffer = Buffer.from(response.data);
  return buffer.toString('base64');
}

/**
 * Get thumbnail URL for a file
 */
export function getThumbnailUrl(file: DriveFile): string | null {
  return file.thumbnailLink || null;
}

/**
 * Check if a file is an image based on its mime type
 */
export function isImageFile(file: DriveFile): boolean {
  const imageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
  ];
  return file.mimeType ? imageMimeTypes.includes(file.mimeType) : false;
}

/**
 * Get web view link for a file
 */
export function getWebViewLink(file: DriveFile): string | null {
  return file.webViewLink || null;
}

/**
 * Parse caption content from texte.md or texte.txt files
 * Supports format:
 *   image-file-name.jpg: Caption text here
 *   another-image.png: Another caption
 * 
 * Also supports markdown format:
 *   ## image-file-name.jpg
 *   Caption text here
 *   
 *   ## another-image.png
 *   Another caption
 */
export function parseCaptionFile(content: string): CaptionMap {
  const captionMap = new Map<string, string>();
  if (!content || typeof content !== 'string') {
    return captionMap;
  }

  // Try format: "filename.jpg: Caption"
  const linePattern = /^([^:\n]+):\s*(.+)$/gm;
  let match;
  
  while ((match = linePattern.exec(content)) !== null) {
    const filename = match[1].trim();
    const caption = match[2].trim();
    if (filename && caption) {
      captionMap.set(filename.toLowerCase(), caption);
    }
  }

  // If no line-based captions found, try markdown format
  if (captionMap.size === 0) {
    let currentFile: string | null = null;
    const lines = content.split('\n');
    let currentCaptionLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('## ')) {
        // Save previous caption if exists
        if (currentFile && currentCaptionLines.length > 0) {
          const caption = currentCaptionLines.join(' ').trim();
          if (caption) {
            captionMap.set(currentFile.toLowerCase(), caption);
          }
        }
        
        // Start new file
        currentFile = trimmedLine.replace(/^##\s*/, '').trim();
        currentCaptionLines = [];
      } else if (currentFile) {
        if (trimmedLine || currentCaptionLines.length > 0) {
          currentCaptionLines.push(trimmedLine);
        }
      }
    }

    // Save last caption
    if (currentFile && currentCaptionLines.length > 0) {
      const caption = currentCaptionLines.join(' ').trim();
      if (caption) {
        captionMap.set(currentFile.toLowerCase(), caption);
      }
    }
  }

  return captionMap;
}

/**
 * Get caption for a specific image file
 */
export function getCaptionForImage(
  imageName: string,
  captionMap: CaptionMap
): string | null {
  const normalizedName = imageName.toLowerCase();
  return captionMap.get(normalizedName) || null;
}

/**
 * Find and fetch caption file (texte.md or texte.txt) from a folder
 */
export async function findCaptionFile(
  folderId: string
): Promise<{ name: string; content: string } | null> {
  const drive = getDriveClient();

  // Look for texte.md or texte.txt files
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false and (name = 'texte.md' or name = 'texte.txt')`,
    fields: 'files(id, name)',
    pageSize: 10,
  });

  const files = response.data.files || [];
  
  if (files.length === 0) {
    return null;
  }

  const captionFile = files[0];
  
  if (!captionFile.id) {
    return null;
  }

  // Download the content
  const content = await downloadTextFile(captionFile.id);
  
  return {
    name: captionFile.name || 'texte',
    content,
  };
}

/**
 * Download a text file (not base64)
 */
export async function downloadTextFile(fileId: string): Promise<string> {
  const drive = getDriveClient();

  const response = await drive.files.get({
    fileId,
    alt: 'media',
  }) as unknown as { data: string };

  return typeof response.data === 'string' 
    ? response.data 
    : JSON.stringify(response.data);
}