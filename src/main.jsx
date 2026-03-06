console.log('[DEBUG] main.jsx execution started');
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
console.log('[DEBUG] Styles imported');
import App from './App.jsx'
console.log('[DEBUG] App imported');

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'white', background: '#09090b', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1>Oops! Something went wrong.</h1>
          <p>Please try refreshing the page or contact the admin.</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#2F8D46', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log('[DEBUG] Attempting to createRoot');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[DEBUG] ROOT ELEMENT NOT FOUND!');
}
const root = createRoot(rootElement);
console.log('[DEBUG] root created, rendering...');

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
console.log('[DEBUG] render() called');
