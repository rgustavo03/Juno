import '../App.css';
import '../css/header.css'
import { Link, useNavigate } from "react-router-dom";
import { styled } from "styled-components"
import { CarrinhoIcon } from "./icons/carrinho-icon"
import { PerfilIcon } from "./icons/perfil-icon"
import { useCarrinho } from "../hooks/useCarrinho"
import { useContext, useEffect, useState } from "react";

import { UserContext } from '../contexts/UserContext';


export function Header() {

  const ir = () => {
    if(window.location.pathname.includes('produto')) {
      return '/home'
    }
    else if(window.location.pathname === '/') {
      return '/home'
    }
    else {
      return window.location.pathname
    }
  }


  const navigate = useNavigate();

  const { logged, setLogged, setUser, cartProv } = useContext(UserContext);

  const { limparCarrinho } = useCarrinho('cartStorage');


  const [qtdCarrinho, setQtdCarrinho] = useState<number>(cartProv.length);

  useEffect(() => {
    setQtdCarrinho(cartProv.length);
  }, [cartProv.length]);


  const [showOpcoes, setShowOpcoes] = useState<boolean>(false);


  const sair = () => {
    setLogged(false);
    setUser({id: '', email: '', nome: ''});
    limparCarrinho();
    navigate('/');
  }



  return (
    <TagHeader id="header">

      <Logo>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <LogoLink>JUNO</LogoLink>
        </Link>
      </Logo>

      <HeaderRightSide>

        <Carrinho>
          <Link to="/carrinho" style={{ textDecoration: 'none' }}>
            <CarrinhoLink>
              <CarrinhoIcon height='22px' />
              { qtdCarrinho > 0 && <CarrinhoQtd>{qtdCarrinho > 9? ('9+') : (qtdCarrinho)}</CarrinhoQtd> }
            </CarrinhoLink>
          </Link>
        </Carrinho>

        <Perfil onMouseOver={() => setShowOpcoes(true)}  onMouseLeave={() => setShowOpcoes(false)}>
          <PerfilLink>
            <PerfilIcon />
          </PerfilLink>
          <PerfilOpcoes style={{ display: showOpcoes? 'flex' : 'none' }}>
            {logged? (
              <>
                <Link to="/perfil"><LoginCadastro>Perfil</LoginCadastro></Link>
                <Link to="/compras"><LoginCadastro>Compras</LoginCadastro></Link>
                <LoginCadastro onClick={() => sair()}>Sair</LoginCadastro>
              </>
            ) : (
              <>
                <Link to={`/entrar${ir()}`}><LoginCadastro>Entrar</LoginCadastro></Link>
                <Link to={`/cadastrar${ir()}`}><LoginCadastro>Cadastrar</LoginCadastro></Link>
              </>
            )}
          </PerfilOpcoes>
        </Perfil>

      </HeaderRightSide>
    </TagHeader>
  );
}



const Perfil = styled.div`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const PerfilLink = styled.div`
  margin-bottom: -5px;
  z-index: 2;
`;
const PerfilOpcoes = styled.div`
  position: absolute;
  width: 120px;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  padding-bottom: 3px;
  box-shadow: 2px 2px 2px 2px rgba(50, 50, 50, 0.2);
  z-index: 1;
`
const LoginCadastro = styled.p`
  margin: 0;
  height: 40px;
  font-famili: var(--main-font);
  font-size: 17px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  cursor: pointer;
  &:hover {
    background-color: rgb(235,235,235);
  }
`


const TagHeader = styled.header`
  height: 80px;
  width: auto;
  background-color: white;
  border-bottom: 1px solid #cacaca;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 20px;
  font-family: var(--main-font);
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LogoLink = styled.h1`
  margin: 0;
  text-decoration: none;
  font-size: 33px;
  font-weight: 400;
  color: black;
`;

const HeaderRightSide = styled.div`
  display: flex;
  flex-direction: row;
`;


const Carrinho = styled.div`
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CarrinhoLink = styled.a`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CarrinhoQtd = styled.span`
  background-color: #bb0404;
  color: white;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  border-radius: 50%;
  position: absolute;
  margin-right: -20px;
  margin-bottom: -20px;
`;

