
import { StrictMode } from 'react';
import { render } from 'react-dom';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import MochimapApi from './app/service/mochimap-api';
import App from './App';

render(
  <ApiProvider api={MochimapApi}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApiProvider>,
  document.getElementById('root')
);
