import React from 'react';//importa o react
import ReactDOM from 'react-dom';//integração do react com o navegador
import App from './App';//importa o app.js

ReactDOM.render(  //renderiza(coloca em tela) o react
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
