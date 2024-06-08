import { useParams, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../css/produto.css';
import { Arvore } from "../components/icons/arvore-icon";
import { useCallback, useEffect, useState } from "react";
import ReactDOMServer from 'react-dom/server';
import { useCarrinho } from "../hooks/useCarrinho";
import { converterPreco } from "../functions/ConverterPreco";
import { MiniCarrinho } from "../components/MiniCarrinho";

import axios from "axios";


type produtoTipo = {
  id: string,
  nome: string,
  tipo: string,
  preco: number,
  cor: string[],
  tamanho: string[],
  r: boolean
}

type stringId = {
  produtoId: string;
}

export function Produto() {

  let navigate = useNavigate();

  // get parameter MELHORAR
  const { produtoId } = useParams<stringId>();

  const voltar = useCallback((h: string) => {
    navigate(h, { replace: true });
  }, [navigate]);

  const [produto, setProduto] = useState<produtoTipo>({id: '', nome: '', tipo: '', preco: 0, cor: [], tamanho: [], r: false});

  useEffect(() => {
    axios.get('http://localhost:3001/item', {
      params: { id: produtoId }
    })
    .then(response => {
      setProduto({
        id: response.data[0].id_prod,
        nome: response.data[0].nome,
        tipo: response.data[0].tipo,
        preco: response.data[0].preco,
        tamanho: JSON.parse(response.data[0].tamanho),
        cor: JSON.parse(response.data[0].cor),
        r: true
      })
    })
    .catch(error => {
      console.log(error);
      voltar('/');
    })
  }, [produtoId, voltar]);


  //-------------------------------------------------------------------------
  //-------------------------------------------------------------------------

  // cor para show Img
  const [img, setImg] = useState<string>(produto.cor[0] || '');

  // definir elementos do produto que será adicionados ao carrinho
  const [cor, setCor] = useState<string>('');
  const [tamanho, setTamanho] = useState<string>('');
  const [qtd, setQtd] = useState<number>(1);

  // converter valor preco
  const precoString = converterPreco(produto.preco); // `R$ {precoString}`
  const precoConfirm = converterPreco(produto.preco * qtd); // `R$ {precoString}`


  // function change cor {setCor, limpar aviso}
  function mudarCor(value: string) {
    setCor(value);
    document.getElementById("coresAviso")!.innerHTML = ''; // clean advise
  }
  // function change tamanho {setTamanho, limpar aviso}
  function mudarTamanho(value: string){
    setTamanho(value);
    document.getElementById("tamanhosAviso")!.innerHTML = ''; // clean advise
  }


  //const [cart, setCart] = useState<itemFormato[]>([]); // carrinho
  const { addCarrinho } = useCarrinho('cartStorage');
  const [clickAddCart, setClickAddCart] = useState<boolean>(false); // Botao Add, block quando aqui esta true
  const [showMiniCart, setShowMiniCart] = useState<boolean>(false); // MiniCarrinho

  function adicionarAoCarrinho() {
    setClickAddCart(true); // block buttonAddCart
    if(cor === '') { // cor nao definida - Aviso. Nao adicionar
      const coresAviso = document.getElementById("coresAviso")!; // get div to insert advise coresAviso
      coresAviso.innerHTML = ReactDOMServer.renderToString(<AvisoTamanho>Escolha a cor</AvisoTamanho>); // insert advise
      setClickAddCart(false); // return button <addCarrinho>
    }
    else if(tamanho === '') { // tamanho nao definido - Aviso. Nao adicionar
      const tamanhosAviso = document.getElementById("tamanhosAviso")!; // get div to insert advise
      tamanhosAviso.innerHTML = ReactDOMServer.renderToString(<AvisoTamanho>Escolha o tamanho</AvisoTamanho>); // insert advise
      setClickAddCart(false); // return button <addCarrinho>
    }
    else { // cor definida - Adicionar ao carrinho
      const item = { // item que vai entrar em cartStorage
        id: produto.id, cor: cor, tamanho: tamanho, qtd: qtd
      };
      //                             // define cart aqui com a funcao dentro do   |
      addCarrinho(item) // custom hook para adicionar ao cartStorage V
      setShowMiniCart(true); // true para aparecer componente MiniCarrinho
    }
  }
  
  

  return (
    <ProdutoPage>
      <Header />

        <Carregando style={{ display: !produto.r? 'flex' : 'none' }}>Carregando</Carregando>

        <ProdutoView id="produtoView" style={{ display: produto.r? 'flex' : 'none' }}>
          <ProdutoViewLeft id="produtoViewLeft">

            <ImgsOpcContainer id="imgsOpcContainer">
              {produto.cor.map(imgCor => {
                // code
                return (
                  <ImgOpcDiv id="imgOpcDiv">
                    <ImgOpc 
                      src={require(`../img/produto/${produto.id}/${produto.id}_${imgCor}.png`)} 
                      alt={produto.nome} 
                      onClick={() => setImg(imgCor)}
                    />
                  </ImgOpcDiv>
                )
              })}
            </ImgsOpcContainer>

            <ImgDiv id="imgDiv">
              {produto.cor[0] &&
                <ProdutoImg 
                  id="produtoImg" 
                  src={require(`../img/produto/${produto.id}/${produto.id}_${img === '' ? produto.cor[0] : img}.png`)} 
                  alt={produto.nome} 
                />
              }
            </ImgDiv>

          </ProdutoViewLeft>


          <ProdutoViewRight id="produtoViewRight">

            <Titulo id="titulo">{produto.nome}</Titulo>

            <Preco id="preco">R$ {precoString}</Preco>

            <Cores>
              <CoresTitulo id="itemTitulo">Cores</CoresTitulo>

              <CoresItens>
                {produto.cor.map((corValue) => {
                  // corValue eh do array map / cor eh do useState
                  let selected: boolean;
                  corValue === cor? selected = true : selected = false
                  return (
                    <>
                      <CorInput key={`input-${corValue}`} type="radio" id={corValue} name="cor" value={corValue} />
                      <CorLabel key={`label-${corValue}`} htmlFor={corValue} id={ selected? 'corSelected' : '' } onClick={() => mudarCor(corValue)} >
                        <CorLabelImg src={require(`../img/produto/${produto.id}/${corValue}.png`)} alt={produto.nome} />
                      </CorLabel> 
                    </>
                  )
                })}
              </CoresItens>

              <div id="coresAviso"></div>
            </Cores>

            <Tamanhos>
              <TamanhosTitulo id="itemTitulo">Tamanho</TamanhosTitulo>

              <TamanhosItens>
                {produto.tamanho.map((tamanhoValue) => {
                  let selected: boolean;
                  tamanhoValue === tamanho? selected = true : selected = false
                  // code
                  return (
                    <>
                      <InputRadioTamanho key={`input-${tamanhoValue}`} type="radio" id={tamanhoValue} name="tamanho" value={tamanhoValue} /> {/*onClick no input*/}
                      <LabelTamanho key={`label-${tamanhoValue}`} htmlFor={tamanhoValue} id={selected? 'tamanhoSelected' : ''} onClick={() => mudarTamanho(tamanhoValue)} >
                        {tamanhoValue}
                      </LabelTamanho>
                    </>
                  )
                })}
              </TamanhosItens>

              <div id="tamanhosAviso"></div>
            </Tamanhos>
            
            <Quantidade>
              <QtdTitulo id="itemTitulo">Quantidade</QtdTitulo>
              <QtdBox>
                {qtd < 2? <BtnMenos disabled id="BtnDisabled" >-</BtnMenos> : <BtnMenos onClick={() => setQtd(qtd - 1)}>-</BtnMenos>}
                <QtdNum>{qtd}</QtdNum>
                <BtnMais  onClick={() => setQtd(qtd + 1)}>+</BtnMais>
              </QtdBox>
            </Quantidade>

            {qtd > 1 && <PrecoConfirmar>Preço x Quantidade: {qtd > 1 && `R$ ${precoConfirm}`}</PrecoConfirmar>}

            <AddCarrinhoContainer>
              {clickAddCart? (
                <AddCarrinhoButao id="addCartBtn" style={{ backgroundColor: '#242424', cursor: 'auto' }}>Adicionado</AddCarrinhoButao>
              ) : (
                <AddCarrinhoButao id="addCartBtn" onClick={() => { adicionarAoCarrinho(); }}>Adicionar ao carrinho</AddCarrinhoButao>
              )}
            </AddCarrinhoContainer>

          </ProdutoViewRight>


          <AvisoCarrinho style={{ display: showMiniCart? 'flex' : 'none' }}>
            {MiniCarrinho(setShowMiniCart)}
          </AvisoCarrinho>

        </ProdutoView>





        <ProdutoDescricao id="descricao">
          <ProdutoDescricaoLeft>
            <ProdutoDescricaoParagrafo>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo cumque beatae ex, numquam recusandae amet, aliquid, voluptas at quidem asperiores dicta! Quod quasi voluptates ducimus, necessitatibus maxime ex officia. Dolores.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo cumque beatae ex, numquam recusandae amet, aliquid, voluptas at quidem asperiores dicta! Quod quasi voluptates ducimus, necessitatibus maxime ex officia. Dolores.
            </ProdutoDescricaoParagrafo>
            <ProdutoDescricaoParagrafo>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo cumque beatae ex, numquam recusandae amet, aliquid, voluptas at quidem asperiores dicta! Quod quasi voluptates ducimus, necessitatibus maxime ex officia. Dolores.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo cumque beatae ex, numquam recusandae amet, aliquid, voluptas at quidem asperiores dicta! Quod quasi voluptates ducimus, necessitatibus maxime ex officia. Dolores.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo cumque beatae ex, numquam recusandae amet, aliquid, voluptas at quidem asperiores dicta! Quod quasi voluptates ducimus, necessitatibus maxime ex officia. Dolores.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo cumque beatae ex, numquam recusandae amet, aliquid, voluptas at quidem asperiores dicta! Quod quasi voluptates ducimus, necessitatibus maxime ex officia. Dolores.
            </ProdutoDescricaoParagrafo>
            <ProdutoDescricaoParagrafo>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo cumque beatae ex, numquam recusandae amet, aliquid, voluptas at quidem asperiores dicta! Quod quasi voluptates ducimus, necessitatibus maxime ex officia. Dolores.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo cumque beatae ex, numquam recusandae amet, aliquid, voluptas at quidem asperiores dicta! Quod quasi voluptates ducimus, necessitatibus maxime ex officia. Dolores.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo cumque beatae ex, numquam recusandae amet, aliquid, voluptas at quidem asperiores dicta! Quod quasi voluptates ducimus, necessitatibus maxime ex officia. Dolores.
            </ProdutoDescricaoParagrafo>
          </ProdutoDescricaoLeft>

          <ProdutoDescricaoRight>
            <Arvore width="230px" />
          </ProdutoDescricaoRight>
        </ProdutoDescricao>

      <Footer />

    </ProdutoPage>
  );
}


const ProdutoPage = styled.section`
  position: relative;
  font-family: var(--main-font);
`;

const Carregando = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ProdutoView = styled.div`
  display: flex;
  flex-direction: row;
  width: auto;
  column-gap: 30px;
  margin-top: 30px;
  padding: 20px;
`

const ProdutoViewLeft = styled.div`
  flex: 5;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  column-gap: 10px;
`
const ImgsOpcContainer = styled.div`
  width: 70px;
  min-width: 65px;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  padding-top: 10px;
  overflow: hidden;
`
const ImgOpcDiv = styled.div`
  width: auto;
  height: 70px;
  border: 1px solid #cecece;
  border-radius: 3px;
  padding: 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
`
const ImgOpc = styled.img`
  height: 100%;
`
const ImgDiv = styled.div`
  display: flex;
  justify-content: center;
  max-height: 500px;
  aspect-ratio: 1 / 1;
`
const ProdutoImg = styled.img`
  height: 100%;
`










const ProdutoViewRight = styled.div`
  flex: 3;
  background-color: white;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
`
const Titulo = styled.p`
  margin: 0;
  font-size: 30px;
`

const Preco = styled.p`
  margin: 0;
  font-size: 26px;
`

const Cores = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`
const CoresTitulo = styled.div`
  font-size: 17px;
  color: #404040;
`
const CoresItens = styled.form`
  display: flex;
  flex-direction: row;
  column-gap: 10px;
`
const CorLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  border: 1px solid;
  cursor: pointer;
  overflow: hidden;
`
const CorLabelImg = styled.img`
  height: 100%;
  -moz-transform: scale(2);
  -webkit-transform: scale(2);
  transform: scale(2);
`
const CorInput = styled.input`
  display: none;
`

const Tamanhos = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`
const TamanhosTitulo = styled.div`
  font-size: 17px;
  color: #404040;
`
const TamanhosItens = styled.form`
  display: flex;
  justify-content: left;
  align-items: center;
  column-gap: 6px;
`
const InputRadioTamanho = styled.input`
  display: none;
  &:checked {
    display: none;
  }
`
const LabelTamanho = styled.label`
  padding: 5px;
  width: 50px;
  border: 1px solid #b1b1b1;
  border-radius: 4px;
  font-size: 19px;
  display: flex;
  justify-content: center;
  cursor: pointer;
`
const AvisoTamanho = styled.div`
  padding: 6px;
  background-color: #bb0404;
  font-size: 18px;
  color: white;
  display: flex;
  justify-content: center;
`

const Quantidade = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  column-gap: 10px;
`
const QtdTitulo = styled.p`
  margin: 0;
  font-size: 18px;
  color: #212121;
`
const QtdBox = styled.div`
  display: flex;
  height: 42px;
  border: 1px solid #909090;
`
const BtnMenos = styled.button`
  width: 40px;
  background: none;
  border: none;
  border-right: 1px solid rgb(180,180,180);
  font-size: 18px;
  cursor: pointer;
`
const BtnMais = styled.button`
  width: 40px;
  background: none;
  border: none;
  border-left: 1px solid rgb(180,180,180);
  font-size: 18px;
  cursor: pointer;
`
const QtdNum = styled.div`
  width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
`

const AddCarrinhoContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 15px;
`
const PrecoConfirmar = styled.p`
  margin: 0;
  font-family: var(--main-font);
  font-size: 20px;
`
const AddCarrinhoButao = styled.button`
  background-color: black;
  padding: 15px;
  padding-left: 35px;
  padding-right: 35px;
  border-radius: 4px;
  border: none;
  font-family: inherit;
  font-size: 18px;
  color: white;
  cursor: pointer;
`

const ProdutoDescricao = styled.div`
  margin-top: 70px;
  background-color: rgb(210, 210, 210);
  padding: 20px;
  display: flex;
  flex-direction: row;
  column-gap: 40px;
`
const ProdutoDescricaoLeft = styled.div`
  flex: 7;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
`
const ProdutoDescricaoParagrafo = styled.p`
  margin: 0;
`
const ProdutoDescricaoRight = styled.div`
  flex: 4;
  display: flex;
  justify-content: center;
  align-items: center;
`

const AvisoCarrinho = styled.div`
  position: absolute;
  right: 0;
  top: 100px;
  width: 380px;
  height: 250px;
  background-color: rgb(250, 250, 250);
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  border-radius: 4px;
  box-shadow: 0px 1.5px 7px 5px rgba(50, 50, 50, 0.2);
  overflow: hidden;
`
