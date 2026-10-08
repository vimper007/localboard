import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.tsx'
import { ThemeContextProvider } from './context/theme-context-provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
