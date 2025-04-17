import React, { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useMarkers } from '@/hooks/useMarkers';
import type { Marker } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import styles from './JsonControls.module.css';

const JsonControls: React.FC = () => {
  const qc = useQueryClient();
  const { markersQuery, clearAll, importBulk } = useMarkers();
  const markers = markersQuery.data ?? [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(markers, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markers.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Markers exported');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Partial<Marker>[];
        const cleaned: Marker[] = data.map((m) => ({
          id: m.id || uuidv4(),
          lng: Number(m.lng),
          lat: Number(m.lat),
          score: Number(m.score),
        }));
        importBulk.mutate(cleaned, {
          onError: () => toast.error('Failed to import markers'),
          onSuccess: () => toast.success('Markers imported'),
        });
      } catch {
        toast.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (!window.confirm('Are you sure you want to delete ALL markers?')) return;
    clearAll.mutate(undefined, {
      onError: () => toast.error('Failed to delete all markers'),
      onSuccess: () => toast.success('All markers deleted'),
    });
  };

  return (
    <div
      className={styles.container}
      role="region"
      aria-label="JSON import, export and clear controls"
    >
      <button
        type="button"
        className={styles.button}
        onClick={handleExport}
        aria-label="Export markers to JSON file"
      >
        Export JSON
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={handleImportClick}
        aria-label="Import markers from JSON file"
      >
        Import JSON
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={handleClearAll}
        aria-label="Delete all markers"
      >
        Delete All
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className={styles.importInput}
        onChange={handleImport}
        aria-label="Hidden file input for JSON import"
      />
    </div>
  );
};

export default JsonControls;
