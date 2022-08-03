import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

const supportsTouch = () => {
  let supports = false
  if (
    ('ontouchstart' in window) ||
    window.DocumentTouch &&
    document instanceof DocumentTouch
  ) {
    supports = true
  }
  return supports
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DndProvider backend={supportsTouch() ? TouchBackend : HTML5Backend}>
      <App />
    </DndProvider>
  </React.StrictMode>
)
