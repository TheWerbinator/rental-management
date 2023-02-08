import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { RentProvider } from './providers/rent_provider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RentProvider>
      <App />
    </RentProvider>
  </React.StrictMode>,
)
