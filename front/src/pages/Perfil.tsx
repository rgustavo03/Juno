import { useCallback, useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContext"
import styled from "styled-components"
import { HeaderAlt } from "../components/HeaderAlt";
import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../hooks/useCarrinho";


export const Perfil = () => {

  const { user, setUser, logged, setLogged } = useContext(UserContext);

  const { limparCarrinho } = useCarrinho('cartStorage');

  const navigate = useNavigate();

  const voltar = useCallback((h: string) => {
    navigate(h, { replace: true })
  },[navigate]);

  useEffect(() => {
    if(!logged) {
      voltar('/');
    }
  }, [logged, voltar]);

  const sair = () => {
    setLogged(false);
    setUser({id: '', email: '', nome: ''});
    limparCarrinho();
    navigate('/');
  }

  return (
    <PerfilPage>
      <HeaderAlt />

      <UsuarioDiv>
        <Nome>{user.nome}</Nome>
        <Email>{user.email}</Email>
        <Sair onClick={() => sair()}>Sair</Sair>
      </UsuarioDiv>

    </PerfilPage>
  )
}


const PerfilPage = styled.section`
  font-family: var(--main-font);
`

const UsuarioDiv = styled.div`
  margin-top: 60px;
  max-width: 90%;
  width: auto;
  display: flex;
  align-items: left;
  flex-direction: column;
  row-gap: 23px;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: white;
`
const Nome = styled.h3`
  margin: 0;
  font-size: 25px;
  font-weight: 500;
  padding-bottom: 3px;
`
const Email = styled.p`
  margin: 0;
  font-size: 16px;
`

const Sair = styled.button`
  margin-top: 10px;
  background-color: rgb(255, 166, 166);
  border: none;
  padding: 7px;
  width: 90px;
  font-size: 17px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: rgb(255, 140, 140);
  }
`