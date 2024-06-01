import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home';
import { Produto } from './pages/Produto';
import { Carrinho } from './pages/Carrinho';
import { Entrar } from './pages/Entrar';
import { Cadastrar } from './pages/Cadastrar';
import { Perfil } from './pages/Perfil';
import { Compras } from './pages/Compras';

import { UserContext } from './contexts/UserContext';


type userType = {
  id: string,
  email: string,
  nome: string
}

type itemCart = {
  id: string,
  cor: string,
  tamanho: string,
  qtd: number,
}


function App() {

  // check url: if url not in app = navigate('/');

  const [user, setUser] = useState<userType>({id: '', email: '', nome: ''});
  const [logged, setLogged] = useState<boolean>(false);
  const [cartProv, setCartProv] = useState<itemCart[]>(JSON.parse(localStorage.getItem('cartStorage') || '[]'));

  useEffect(() => {
    if(!logged) {
      setLogged(false);
      setUser({id: '', email: '', nome: ''});
    }
  },[logged])

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser, logged, setLogged, cartProv, setCartProv }}>
        <Router>
          <Routes>
            <Route Component={ Home } path="/" />
            <Route Component={ Produto } path="/produto/:produtoId" />
            <Route Component={ Carrinho } path="/carrinho" />
            <Route Component={ Entrar } path="/entrar/:ir" />
            <Route Component={ Cadastrar } path="/cadastrar/:ir" />
            <Route Component={ Perfil } path="/perfil" />
            <Route Component={ Compras } path="/compras" />
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
