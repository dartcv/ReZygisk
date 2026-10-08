import './lib/polyfills.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { installErrorHandlers } from './lib/logger.js'
import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'

installErrorHandlers()

createRoot(document.querySelector('#root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
