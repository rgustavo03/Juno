import styled from "styled-components"
import '../css/compras.css'
import { Header } from "../components/Header"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { converterPreco } from "../functions/ConverterPreco"

type item = {
  id: string,
  qtd: number,
  tamanho: string,
  cor: string
}

type compra = {
  id_compra: number,
  data: string,
  hora: string,
  compra: string, // escrito em forma de string, depois usar: JSON.parse
  preco: number,
  id_usuario: number
}


export const Compras = () => {

  const navigate = useNavigate();

  const { user, logged, cartProv } = useContext(UserContext);

  const [compras, setCompras] = useState<compra[]>([]);

  const [vazio, setVazio] = useState<boolean>(false);

  useEffect(() => {
    if(!logged) {
      navigate(`/`);
    }
  }, [logged]);


  const getCompras = async () => {
    axios.get("http://localhost:3001/compras", {
      params: { id: user.id }
    })
    .then(response => {
      if(response.data.r) {
        if(response.data.c.length > 0) {
          setCompras(response.data.c);
        } else {
          setVazio(true);
        }
      } else {
        console.log(response.data.r); // <DivErro>{response.data.msg}</DivErro>
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  useEffect(() => {
    getCompras();
  }, [cartProv]);


  const mapCompras = compras.map(({id_compra,data,hora,compra,preco,id_usuario}, i) => {
    const itens: item[] = JSON.parse(compra);
    const ano: string = data.slice(0,4);
    const mes: string = data.slice(5,7);
    const dia: string = data.slice(8,10);

    return (
      <Compra key={i}>
        <Top>
          <DataHora>
            <Data>{dia}/{mes}/{ano},</Data>
            <Hora>{hora.slice(0,5)}</Hora>
          </DataHora>
          <PrecoTotal>Preço da compra: R$ <N>{converterPreco(preco)}</N></PrecoTotal>
        </Top>

        <Mid>
          <MidCompras>
            {itens.map((item, i) => {
              //
              return (
                <Item key={i}>
                  <ImgDiv>
                    <Img src={require(`../img/produto/${item.id}/${item.id}_${item.cor}_low.png`)} alt={item.id} />
                  </ImgDiv>
                  {item.qtd} unidade(s), tamanho {item.tamanho}, {item.cor}
                </Item>
              )
            })}
          </MidCompras>
        </Mid>

        <Id>
          Id da compra: {id_compra}
        </Id>
      </Compra>
    )
  })
  
  
  return (
    <ComprasPage style={{ display: logged ? 'inline' : 'none'}}>

      <Header />

      <ComprasMain id="comprasMain">

        <Titulo>Suas compras, {user.nome}</Titulo>

        {mapCompras}

        {vazio && 'Você ainda não fez compras :)'}

      </ComprasMain>

    </ComprasPage>
  )
}

const ComprasPage = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ededed;
  font-family: var(--main-font);
`
const ComprasMain = styled.div`
  min-width: 370px;
  padding: 60px;
  background-color: white;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`

const Titulo = styled.h2`
  margin: 0;
  font-size: 21px;
  font-weight: 400;
  margin-bottom: 8px;
`

const Compra = styled.div`
  min-width: 490px;
  display: flex;
  flex-direction: column;
  row-gap: 7px;
  border: 1px solid #cecece;
  padding: 7px;
`
const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const DataHora = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 5px;
`
const Data = styled.p`
  margin: 0;
  font-size: 21px;
  font-weight: 600;
`
const Hora = styled.p`
  margin: 0;
  font-size: 20px;
  color: black;
`
const PrecoTotal = styled.p`
  margin: 0;
  font-size: 19px;
  display: flex;
  flex-direction: row;
  column-gap: 6px;
`
const N = styled.p`
  margin: 0;
  font-size: 21px;
  font-weight: 600;
`
const Mid = styled.div`
`
const MidCompras = styled.div`
  background-color: rgb(230,230,230);
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  padding: 4px;
`
const Item = styled.p`
  margin: 0;
  font-size: 17px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
`
const ImgDiv = styled.div`
  height: 50px;
  width: 50px;
  background-color: rgba(255,255,255,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`
const Img = styled.img`
  height: 100%;
`
const Id = styled.p`
  margin: 0;
  font-size: 14px;
  color: rgb(40,40,40);
  display: flex;
  justify-content: right;
`
