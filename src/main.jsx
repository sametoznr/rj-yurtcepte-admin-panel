import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from '@toolpad/core/AppProvider';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/index.jsx';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(

  <Provider store={store}>

    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </Provider>

)
