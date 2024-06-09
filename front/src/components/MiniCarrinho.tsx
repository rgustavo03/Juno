import { styled } from "styled-components";
import '../css/minicarrinho.css';
import { CarrinhoIcon } from "./icons/carrinho-icon";
import { CloseIcon } from "./icons/close-icon";
import { converterPreco } from "../functions/ConverterPreco";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

type produtoTipo = {
  id: string,
  nome: string,
  tipo: string,
  preco: number,
  tamanho: string[],
  cor: string[]
}

type funcBoolean = (a: boolean) => void;

export const MiniCarrinho = (setShowMiniCart: funcBoolean) => {

  const { cartProv } = useContext(UserContext);

  const [produtos, setProdutos] = useState<produtoTipo[]>([]);

  const [precoTotal, setPrecoTotal] = useState<string>('');



  useEffect(() => {
    cartProv.forEach(cp => {
      const getItem = async (id: string) => {
        axios.get('http://localhost:3001/item', {
          params: { id: id }
        })
        .then(response => {
          const item: produtoTipo = {
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

  },[cartProv]);



  useEffect(() => {
    let precoT: number = 0;

    cartProv.forEach(c => {
      let preco: number = NaN;
      produtos.forEach(p => {
        if(p.id === c.id) {
          preco = p.preco;
        }
      })
      precoT += preco * c.qtd
    });

    setPrecoTotal(converterPreco(precoT));

  },[cartProv, produtos]);



  return (
    <>
      <AvisoCarrinhoTop>
        <CarrinhoIcon height='20px' />
        <BtnClose onClick={() => setShowMiniCart(false)} >
          <CloseIcon height='25px' />
        </BtnClose>
      </AvisoCarrinhoTop>

      <AvisoCarrinhoMid>
        {cartProv.map(item => {
          
          let nome: string = '';
          let preco: string = '';

          produtos.forEach(p => {
            if(p.id === item.id) {
              nome = p.nome;
              preco = converterPreco(p.preco * item.qtd);
            }
          });

          return (
            <ItemCart id="itemCart">
              <ItemCartImgContainer>
                <ItemCartImg src={require(`../img/produto/${item.id}/${item.id}_${item.cor}_low.png`)} alt={nome} />
              </ItemCartImgContainer>
              <ItemCartInfo>
                <ItemCartNome id="nome">{nome}</ItemCartNome>
                <ItemCartEsp>
                  <ItemCartEspItem id="itemCartEspItem">{item.cor}</ItemCartEspItem>
                  <ItemCartEspItem id="itemCartEspItem">{item.tamanho}</ItemCartEspItem>
                  <ItemCartEspItem id="itemCartEspItem">{item.qtd}</ItemCartEspItem>
                </ItemCartEsp>
                <ItemCartPreco id="itemPreco">R$ {preco}</ItemCartPreco>
              </ItemCartInfo>
            </ItemCart>
          )
        })}
      </AvisoCarrinhoMid>

      <AvisoCarrinhoBottom>
        <PrecoTotal>
          <PrecoTotalText id="precoText">Total: R$</PrecoTotalText>
          <PrecoTotalValor id="precoValor">{precoTotal}</PrecoTotalValor>
        </PrecoTotal>
        <Link to="/carrinho">
          <IrCarrinhoBtn id="cartBtn">Carrinho {`>>`}</IrCarrinhoBtn>
        </Link>
      </AvisoCarrinhoBottom>
    </>
  )
}



const AvisoCarrinhoTop = styled.div`
  width: auto;
  height: 41px;
  border-bottom: 1px solid rgb(200, 200, 200);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  padding-right: 5px;
  transition: 0.2s;
`
const BtnClose = styled.div`
  height: 41px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: rgb(194, 43, 43);
  }
`

const AvisoCarrinhoMid = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  padding-left: 3px;
`
const ItemCart = styled.div`
  height: 80px;
  width: auto;
  display: flex;
  flex-direction: row;
  column-gap: 5px;
`
const ItemCartImgContainer = styled.div`
  height: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`
const ItemCartImg = styled.img`
  height: 100%;
`
const ItemCartInfo = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  justify-content: center;
  align-items: left;
  overflow-x: hidden;
`
const ItemCartNome = styled.p`
  margin: 0;
  width: auto;
  font-family: var(--main-font);
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const ItemCartEsp = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 5px;
`
const ItemCartEspItem = styled.p`
  margin: 0;
  font-family: var(--main-font);
  font-size: 17px;
  font-weight: 400;
  background-color: #dbdbdb;
  padding: 2px;
  padding-left: 4px;
  padding-right: 4px;
`
const ItemCartPreco = styled.p`
  margin: 0;
  font-family: var(--main-font);
  font-size: 17px;
  font-weight: 600;
`

const AvisoCarrinhoBottom = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  justify-content: right;
  align-items: center;
  box-shadow: 0px 1.5px 6px 6px rgba(50, 50, 50, 0.1);
`
const PrecoTotal = styled.div`
  font-family: var(--main-font);
  font-size: 20px;
  display: flex;
  flex-direction: row;
  column-gap: 5px;
  justify-content: center;
  align-items: center;
`
const PrecoTotalText = styled.p`
  margin: 0;
  font-size: 18px;
`
const PrecoTotalValor = styled.p`
  margin: 0;
  margin-top: -4px;
  font-size: 19px;
`
const IrCarrinhoBtn = styled.button`
  margin-right: 7px;
  height: 40px;
  padding-left: 15px;
  padding-right: 15px;
  background-color: black;
  border: none;
  color: white;
  font-family: var(--main-font);
  font-size: 18px;
  border-radius: 3px;
  cursor: pointer;
`