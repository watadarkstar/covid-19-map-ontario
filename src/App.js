import React from 'react';
import { SWRConfig } from 'swr';

import './App.css';
import MainRouter from './modules/MainRouter';
import SWRService from './api/SWRService';

const swrConfig = {
  shouldRetryOnError: false,
  fetcher: SWRService.fetcher(),
};

function App() {
  return (
    <div className="App">
      <SWRConfig value={swrConfig}>
        <MainRouter />
      </SWRConfig>
    </div>
  );
}

export default App;
