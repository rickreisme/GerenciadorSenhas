import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from './App.jsx'

import "./assets/styles/global.scss";
import CadastroPage from './routes/cadastroPage.jsx';
import LoginPage from './routes/LoginPage.jsx';
import HomePage from './routes/homePage.jsx';
import SenhaPage from './routes/gerarSenhaPage.jsx';
import ResetSenhaPage from './routes/resetSenhaPage.jsx';
import FavoritosPage from './routes/favoritosPage.jsx';
import NotasPage from './routes/notasPage.jsx';
import ConfigPage from './routes/configPage.jsx';
import SobrePage from './routes/sobrePage.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="cadastro" element={<CadastroPage />} />
          <Route path="dashboard" element={<HomePage />} />
          <Route path="criar-senha" element={<SenhaPage/>} />
          <Route path="reset-senha" element={<ResetSenhaPage/>} />
          <Route path="favoritos" element={<FavoritosPage/>} />
          <Route path="notas" element={<NotasPage/>} />
          <Route path="configuracoes" element={<ConfigPage/>} />
          <Route path="/configuracoes/sobre" element={<SobrePage/>} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
)