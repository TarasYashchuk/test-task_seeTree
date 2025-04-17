import React, { Suspense, lazy } from 'react';
import MapView from '@/components/MapView';

const StatsPanel = lazy(() => import('@/components/StatsPanel'));
const JsonControls = lazy(() => import('@/components/JsonControls'));

import styles from './App.module.css';

const App: React.FC = () => (
  <div className={styles.container}>
    <MapView />
    <Suspense
      fallback={
        <div role="status" aria-live="polite" style={{ position: 'absolute', top: 16, right: 16 }}>
          Loading stats…
        </div>
      }
    >
      <StatsPanel />
    </Suspense>
    <Suspense fallback={null}>
      <JsonControls />
    </Suspense>
  </div>
);

export default App;
