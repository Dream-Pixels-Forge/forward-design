# Google Drive Integration

## Overview

This module provides integration with Google Drive for serving portfolio images.

## Setup

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Google Drive API**
4. Go to **APIs & Services** > **Credentials**
5. Create a **Service Account**:
   - Name: `portfolio-drive`
   - Role: Leave blank (we only need read access via API)
6. Generate **JSON key** and download it
7. Copy the `client_email` and `private_key` values

### 2. Share Folder

1. Open your portfolio folder in Google Drive
2. Right-click > Share
3. Add the service account email (e.g., `portfolio-drive@project.iam.gserviceaccount.com`)
4. Give it **Viewer** access

### 3. Get Folder ID

1. Open the folder in Google Drive
2. The folder ID is the part after `folders/` in the URL
   - Example: `https://drive.google.com/drive/folders/ABC123xyz...`
   - Folder ID: `ABC123xyz...`

### 4. Configure Environment

Copy `.env.example` to `.env.local` and fill in the values:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
```

## API Endpoints

### GET /api/drive/contents

Lists all images in the configured folder.

**Response:**
```json
{
  "folderId": "abc123",
  "count": 10,
  "images": [
    {
      "id": "file123",
      "name": "photo-001.jpg",
      "mimeType": "image/jpeg",
      "thumbnailLink": "https://...",
      "webViewLink": "https://...",
      "createdTime": "2024-01-01T00:00:00.000Z",
      "modifiedTime": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/drive/image/[id]

Gets a specific image's metadata and base64 content.

**Response:**
```json
{
  "id": "file123",
  "name": "photo-001.jpg",
  "mimeType": "image/jpeg",
  "thumbnailLink": "https://...",
  "webViewLink": "https://...",
  "data": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

## Usage Example

```typescript
import { 
  getDriveClient, 
  getFolderId, 
  listFolderContents 
} from '@/lib/drive/client';

// List all images in the folder
const files = await listFolderContents();
console.log(files);
```

## Security Notes

- The service account should only have **read-only** access to Drive
- The private key should never be committed to version control
- Use `.env.local` for local development (already gitignored)
- Consider rotating keys periodically