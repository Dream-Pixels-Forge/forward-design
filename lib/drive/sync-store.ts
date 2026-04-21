/**
 * In-Memory Sync Status Store
 * 
 * Stores sync state for the Google Drive integration
 * Note: This resets on server restart. For production, consider using a database or file-based storage.
 */

// Sync status types
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncState {
  status: SyncStatus;
  lastSyncTime: string | null;
  errorMessage: string | null;
  lastSyncDuration: number | null; // in milliseconds
}

// In-memory sync state (resets on server restart)
let syncState: SyncState = {
  status: 'idle',
  lastSyncTime: null,
  errorMessage: null,
  lastSyncDuration: null,
};

/**
 * Get current sync state
 */
export function getSyncState(): SyncState {
  return { ...syncState };
}

/**
 * Update sync state
 */
export function setSyncState(newState: Partial<SyncState>): void {
  syncState = { ...syncState, ...newState };
}

/**
 * Mark sync as starting
 */
export function startSync(): void {
  syncState = {
    status: 'syncing',
    lastSyncTime: syncState.lastSyncTime,
    errorMessage: null,
    lastSyncDuration: null,
  };
}

/**
 * Mark sync as completed successfully
 */
export function completeSync(duration: number): void {
  const now = new Date().toISOString();
  syncState = {
    status: 'success',
    lastSyncTime: now,
    errorMessage: null,
    lastSyncDuration: duration,
  };
}

/**
 * Mark sync as failed
 */
export function failSync(error: string): void {
  syncState = {
    status: 'error',
    lastSyncTime: syncState.lastSyncTime,
    errorMessage: error,
    lastSyncDuration: null,
  };
}

/**
 * Reset to idle state
 */
export function resetSync(): void {
  syncState = {
    status: 'idle',
    lastSyncTime: syncState.lastSyncTime,
    errorMessage: null,
    lastSyncDuration: null,
  };
}

/**
 * Format last sync time for display
 */
export function formatLastSyncTime(isoString: string | null): string {
  if (!isoString) {
    return 'Never';
  }
  
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) {
    return 'Just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  
  // Fall back to date string
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}