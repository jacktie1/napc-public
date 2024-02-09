import {createRoot} from 'react-dom/client';
import App from './app/App';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import './assets/styles/App.scss'
import { UserSession } from './auth/UserSession';


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
    <UserSession>
      <App />
    </UserSession>
  );