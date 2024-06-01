import { Link, useNavigate } from "react-router-dom";
import '../App.css';
import '../css/carrinho.css';
import { styled } from "styled-components";
import { Header } from '../components/Header';

import { converterPreco } from "../functions/ConverterPreco";
import { useCarrinho } from "../hooks/useCarrinho";
import { useEffect, useState, useContext } from "react";
import { AlterarItem } from "../components/AlterarItem";
import { CloseIcon } from "../components/icons/close-icon";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";


interface itemFormato {
  id: string,
  cor: string,
  tamanho: string,
  qtd: number,
}
interface ProdutoTipo {
  id: string,
  nome: string,
  tipo: string,
  preco: number,
  cor: string[],
  tamanho: string[]
}


export function Carrinho() {

  const navigate = useNavigate(); // Usar quando confirmar compra

  const { cartProv, logged, user } = useContext(UserContext);

  const [produtos, setProdutos] = useState<ProdutoTipo[]>([]);

  const [precoTotal, setPrecoTotal] = useState<number>(NaN);

  const [cartVazio, setCartVazio] = useState<boolean>(true);

  
  const calcPrecoTotal = () => {
    let precoT: number = 0;
    cartProv.map(c => {
      let preco: number = NaN;
      produtos.map(p => {
        if(p.id === c.id) {
          preco = p.preco;
        }
      })
      precoT += preco * c.qtd
    });
    setPrecoTotal(precoT);
  }


  // checar carrinho vazio; calcular preco total; pegar dados de cada produto
  useEffect(() => {

    if(!cartProv) {
      //setCartProv([]);
      setCartVazio(true);
    }
    else {
      if (cartProv.length === 0) {
        setCartVazio(true);
      } else { 
        setCartVazio(false);
      }
    }

    //-----------------------

    cartProv.map(cp => {
      const getItem = async (id: string) => {
        axios.get('http://localhost:3001/item', {
          params: { id: id }
        })
        .then(response => {
          const item: ProdutoTipo = {
            id: response.data[0].id_prod,
            nome: response.data[0].nome,
            tipo: response.data[0].tipo,
            preco: response.data[0].preco,
            tamanho: JSON.parse(response.data[0].tamanho),
            cor: JSON.parse(response.data[0].cor)
          }
          setProdutos(array => [...array, item]);
        })
      }
      getItem(cp.id);
    })

    //-----------------------

    calcPrecoTotal();

  }, [cartProv]);


  useEffect(() => {
    calcPrecoTotal();
  },[produtos]);

  


  // funcao remover item de carrinho no hook useCarrinho
  const { removerCarrinho, limparCarrinho } = useCarrinho('cartStorage');

  const removerItemCart = (item: itemFormato) => {
    removerCarrinho(item);
  }


  // alter true = aparece tela de alterar item, false = some a tela
  const [alter, setAlter] = useState<boolean>(false);

  const [produto, setProduto] = useState<ProdutoTipo>({id: '', nome: '', tipo: '', preco: NaN, cor: [], tamanho: []});
  const [produtoPrev, setProdutoPrev] = useState<itemFormato>({id: '', cor: '', tamanho: '', qtd: NaN});
  const [index, setIndex] = useState<number>(NaN);

  const alterar = (itemAlt: itemFormato, indexAlt:number) => {

    produtos.map(item => {
      if(item.id === itemAlt.id) {

        setProduto({id: item.id, nome: item.nome, tipo: item.tipo, preco: item.preco, cor: item.cor, tamanho: item.tamanho});
        setProdutoPrev({id: itemAlt.id, cor: itemAlt.cor, tamanho: itemAlt.tamanho, qtd: itemAlt.qtd});
        setIndex(indexAlt);

        setAlter(true);
  
      } else {
        // throw error
        return
      }
    })

  }

  function fecharAlter() {
    setAlter(false);
    setProduto({id: '', nome: '', tipo: '', preco: NaN, cor: [], tamanho: []}); // talver inutil
    setProdutoPrev({id: '', cor: '', tamanho: '', qtd: NaN}); // talvez inutil
    setIndex(NaN); // talvez inutil
  }

  const finalizarCompra = async () => {

    const datetime = new Date();
    const data = String(`${datetime.getFullYear()}/${datetime.getMonth()}/${datetime.getDate()}`);
    const hora = String(`${datetime.getHours()}:${datetime.getMinutes()}`);

    axios.post('http://localhost:3001/finalizarcompra', {
      data: data,
      hora: hora,
      compra: JSON.stringify(cartProv),
      preco: precoTotal,
      idUsuario: user.id
    })
    .then(response => {
      if(response.data.r) {
        // add div verde
        // await 3000
        limparCarrinho();
        navigate('/compras');
      } else {
        console.log(response.data); // colocar div vermelha com aviso
      }
    })
    .catch(error => {
      console.log(error);
    })
    //
  }


  return (
    <CarrinhoPage>

      {/*------ HEADER ------*/}
      <Header />

      <CarrinhoBody id="carrinhobody">

        <CarrinhoSection id="carrinhosection">

          <CarrinhoTitulo>
            Carrinho
          </CarrinhoTitulo>

          {!cartVazio && <Carregando style={{ display: produtos.length === 0? 'flex' : 'none'}}>Carregando</Carregando>}

          {/*------ ItemsDiV ------*/}

          <ItemsDiv>

            {cartVazio? <CarrinhoVazio>O carrinho parece vazio... <Link to="/" style={{ textDecoration: 'none' }}>Vamos às compras?</Link></CarrinhoVazio> : <></>}

            {produtos.length !== 0 && <>
              {cartProv.map(({id, cor, tamanho, qtd}, i) => {
                let nome: string = '';
                let preco: string = '';

                produtos.map(p => {
                  if(p.id === id) {
                    nome = p.nome;
                    preco = converterPreco(p.preco * qtd);
                  }
                });
              
                return (
                  <ItemContainer key={`${id}-${cor}-${tamanho}-${qtd}`} style={{ display: produtos.length === 0? 'none' : 'flex'}}>
                    
                    <ItemImgDiv id="imgDiv">
                      <ItemImg id="itemImg" src={require(`../img/produto/${id}/${id}_${cor}_low.png`)} alt={nome} />
                    </ItemImgDiv>

                    <ItemInfo>

                      <ItemNome id="itemNome">{nome}</ItemNome>

                      <ItemMid id="itemMid">
                        <ItemNums>
                          <ItemEsp id="itemEsp">{cor}</ItemEsp>
                          <ItemEsp id="itemEsp">{tamanho}</ItemEsp>
                          <ItemEsp id="itemEsp">{qtd} unidade(s)</ItemEsp>
                        </ItemNums>

                        <ItemAltRem>
                          <AlterarBtn id="alterarBtn" onClick={() => { alterar({id, cor, tamanho, qtd}, i) }}>Alterar</AlterarBtn>
                          <RemoverBtn id="removerBtn" onClick={() => { removerItemCart({id, cor, tamanho, qtd}) }} >Remover</RemoverBtn>
                        </ItemAltRem>
                      </ItemMid>

                      <ItemPreco id="itemPreco">R$ {preco}</ItemPreco>

                    </ItemInfo>

                  </ItemContainer>
                )
              })
              }
            </>}
          
          </ItemsDiv>
          {/*------ ItemsDiV ------*/}

          {produtos.length !== 0 && (
          <LimparCarrinho>
            {cartVazio? <></> : <LimparBtn id="limparBtn" onClick={() => limparCarrinho()} >Limpar carrinho</LimparBtn>}
          </LimparCarrinho>
          )}

        </CarrinhoSection>



        {cartVazio? (
          <></>
        ) : (
          <FinalizarContainer>
            <PrecoTotal>
              <PrecoTotalText>Preço total: R$</PrecoTotalText>
              <PrecoTotalValor>{converterPreco(precoTotal)}</PrecoTotalValor>
            </PrecoTotal>
            {produtos.length !== 0 && (
              <>
                {logged ? (
                  <FinalizarBtn onClick={() => finalizarCompra()}>Finalizar compra</FinalizarBtn>
                ) : (
                  <Link to="/entrar/compra"><FinalizarBtn>Finalizar compra</FinalizarBtn></Link>
                )}
              </>
            )} {/* check login */}
          </FinalizarContainer>
        )}

      </CarrinhoBody>



      <AlterarItemScreen style={alter? { display: 'flex' } : { display: 'none' }}>
        <AlterItemContainer id="alterarItemContainer">

          <AlterItemContainerTop>
            <AlterItemCloseBtn onClick={ () => fecharAlter() }>
              <CloseIcon height='22px' /> {/* close button */}
            </AlterItemCloseBtn>
          </AlterItemContainerTop>

          {AlterarItem(produto, produtoPrev, setProdutoPrev, index, setAlter)}

        </AlterItemContainer>
      </AlterarItemScreen>

    </CarrinhoPage>
  );
}


const CarrinhoPage = styled.section`
  position: relative;
`;

const CarrinhoBody = styled.section`
  background-color: #ededed;
  height: auto;
  width: auto;
  padding-top: 50px;
  padding-bottom: 50px;
  display: grid;
  grid-template-columns: minmax(500px,730px) 1fr;
  column-gap: 30px;
`

const CarrinhoSection = styled.section`
  background-color: white;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 40px;
  padding-right: 7px;
`;

const CarrinhoTitulo = styled.h2`
  margin: 0;
  padding-top: 7px;
  padding-bottom: 8px;
  font-family: var(--main-font);
  font-size: 21px;
  font-weight: 400;
`
const Carregando = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const ItemsDiv = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 18px;
  padding-bottom: 5px;
`
const CarrinhoVazio = styled.div`
  background-color: #dbdbdb;
  font-family: var(--main-font);
  font-size: 16px;
  font-weight: 400;
  padding: 6px;
  padding-left: 6px;
  padding-right: 6px;
`
const ItemContainer = styled.div`
  min-width: 400px;
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
  padding-bottom: 5px;
`
const ItemImgDiv = styled.div`
  height: 135px;
  min-width: 100px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ItemImg = styled.img`
  height: 100%;
`
const ItemInfo = styled.div`
  height: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding-top: 3px;
  padding-bottom: 4px;
`
const ItemNome = styled.p`
  margin: 0;
  font-family: var(--main-font);
  font-size: 18px;
  font-weight: 300;
`



const ItemMid = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 5px;
`
const ItemNums = styled.div`
  display: flex;
  column-gap: 3px;
`
const ItemEsp = styled.p`
  margin: 0;
  font-family: var(--main-font);
  font-size: 17px;
  font-weight: 400;
  background-color: #dbdbdb;
  padding: 3px;
  padding-left: 6px;
  padding-right: 6px;
`
const ItemAltRem = styled.div`
  display: flex;
  column-gap: 3px;
`
const AlterarBtn = styled.button`
  background: none;
  border: 1px solid #bdbdbd;
  font-family: var(--main-font);
  font-size: 16px;
  font-weight: 400;
  padding: 3px;
  padding-left: 8px;
  padding-right: 8px;
  cursor: pointer;
`
const RemoverBtn = styled.button`
  background: none;
  border: none;
  color: #e63030;
  font-family: var(--main-font);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
`


const ItemPreco = styled.p`
  margin: 0;
  font-family: var(--main-font);
  font-size: 18px;
  font-weight: 500;
`

const LimparCarrinho = styled.div`
  padding-top: 5px;
  padding-bottom: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: right;
`

const LimparBtn = styled.button`
  background: none;
  border: 1px solid #bdbdbd;
  font-family: var(--main-font);
  font-size: 15px;
  font-weight: 400;
  padding: 3px;
  padding-left: 8px;
  padding-right: 8px;
  cursor: pointer;
`

//-----------------------------
//-----------------------------

const AlterarItemScreen = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(240, 240, 240, 0.5);
  z-index: 2;
  display: flex;
  justify-content: center;
  padding-top: 20px;
`

const AlterItemContainer = styled.div`
  background: rgba(255,255,255);
  height: 600px;
  width: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(145,145,145);
`

const AlterItemContainerTop = styled.div`
  height: 35px;
  display: flex;
  flex-direction: row;
  justify-content: right;
`

const AlterItemCloseBtn = styled.button`
  height: 100%;
  aspect-ratio: 1 / 1;
  background: rgba(237, 69, 69);
  border: none;
  transition: 0.3s;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgba(245, 100, 100);
  }
`




const FinalizarContainer = styled.div`
  height: 100px;
  background-color: white;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  justify-content: center;
  align-items: left;
  padding: 15px;
`
const PrecoTotal = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 5px;
`
const PrecoTotalText = styled.p`
  margin: 0;
  font-family: var(--main-font);
  font-size: 19px;
`
const PrecoTotalValor = styled.p`
  margin: 0;
  font-family: var(--main-font);
  font-size: 21px;
  font-weight: 600;
`
const FinalizarBtn = styled.button`
  height: 45px;
  background-color: black;
  border: none;
  border-radius: 3px;
  color: white;
  font-family: var(--main-font);
  font-size: 19px;
  cursor: pointer;
`