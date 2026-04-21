"use client";

import { useState, useEffect, useCallback } from 'react';

// Sync state from API
interface SyncState {
  status: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  errorMessage: string | null;
  lastSyncDuration: number | null;
  formattedLastSyncTime: string;
}

/**
 * SyncStatus Component
 * 
 * Shows sync status with last sync time and manual trigger button
 * Used for the Google Drive integration
 */
export function SyncStatus() {
  const [syncState, setSyncState] = useState<SyncState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current sync status
  const fetchSyncStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/drive/sync', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sync status');
      }
      
      const data = await response.json();
      setSyncState(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  // Trigger manual sync
  const triggerSync = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/drive/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setSyncState(data);
      
      if (!response.ok) {
        setError(data.error || 'Sync failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync request failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch status on mount
  useEffect(() => {
    fetchSyncStatus();
  }, [fetchSyncStatus]);

  // Determine status display
  const getStatusDisplay = () => {
    if (isLoading || syncState?.status === 'syncing') {
      return {
        text: 'Syncing...',
        color: 'text-foreground-muted',
        dotColor: 'bg-amber-500 animate-pulse',
      };
    }
    
    if (syncState?.status === 'error') {
      return {
        text: 'Error',
        color: 'text-red-500',
        dotColor: 'bg-red-500',
      };
    }
    
    if (syncState?.status === 'success') {
      return {
        text: 'Synced',
        color: 'text-green-500',
        dotColor: 'bg-green-500',
      };
    }
    
    // idle or never synced
    return {
      text: 'Ready',
      color: 'text-foreground-muted',
      dotColor: 'bg-foreground-muted/40',
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="flex items-center gap-4">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        {/* Status dot */}
        <span 
          className={`block h-2 w-2 rounded-full ${statusDisplay.dotColor}`}
          aria-hidden="true"
        />
        
        {/* Status text */}
        <span className={`font-mono text-xs ${statusDisplay.color}`}>
          {statusDisplay.text}
        </span>
      </div>
      
      {/* Last sync time */}
      {syncState?.formattedLastSyncTime && (
        <span className="font-mono text-xs text-foreground-muted/60">
          {syncState.formattedLastSyncTime}
        </span>
      )}
      
      {/* Manual sync button */}
      <button
        onClick={triggerSync}
        disabled={isLoading}
        className="group flex items-center gap-1.5 rounded border border-foreground-muted/20 px-3 py-1.5 font-mono text-xs text-foreground-muted transition-all hover:border-foreground-muted/40 hover:bg-foreground-muted/5 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Sync now"
      >
        {/* Sync icon - rotates when loading */}
        <svg 
          className={`h-3 w-3 transition-transform duration-500 group-hover:scale-110 ${
            isLoading ? 'animate-spin' : ''
          }`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        
        <span>Sync</span>
      </button>
      
      {/* Error message */}
      {error && (
        <span className="font-mono text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}