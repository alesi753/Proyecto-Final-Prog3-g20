import React from 'react';
import './App.css';
const API_URL = process.env.REACT_APP_API_URL ?? '';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>¡Bienvenido a tu nueva aplicación!</h1>
        <p>Frontend React funcionando correctamente</p>
        <p>
          <a href={`${API_URL}/health`} target="_blank" rel="noopener noreferrer">
            Verificar estado de la API
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
