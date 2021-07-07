
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Store } from './store';
import App from './App';

render(
  <Provider store={Store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>,
  document.getElementById('root')
);
