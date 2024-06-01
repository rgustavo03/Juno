
import { useCarrinho } from "../hooks/useCarrinho";
import { useState } from "react";
import { styled } from "styled-components";
import '../css/carrinho.css';
import { converterPreco } from "../functions/ConverterPreco";


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

const produto: ProdutoTipo = {
  id: '',
  nome: '',
  tipo: '',
  preco: NaN,
  cor: [],
  tamanho: []
}
const produtoPrev: itemFormato = {
  id: '',
  cor: '',
  tamanho: '',
  qtd: NaN
}

type funcBoolean = (a: boolean) => void;

type setItemType = (a: itemFormato) => void;


export const AlterarItem = (produto: ProdutoTipo, produtoPrev: itemFormato, setProdutoPrev: setItemType, indexAlt: number, setAlter: funcBoolean) => {

  const [btnWait, setBtnWait] = useState<boolean>(false);
  const { alterItemCarrinho } = useCarrinho('cartStorage');

  function altItem() {
    setBtnWait(true);
    // try
    alterItemCarrinho({
      id: produto.id,
      cor: produtoPrev.cor,
      tamanho: produtoPrev.tamanho,
      qtd: produtoPrev.qtd
    }, indexAlt, setAlter, setBtnWait, setProdutoPrev);

    indexAlt = NaN;
  }

  const mudarCor = (cores: React.ChangeEvent<HTMLSelectElement>) => {
    setProdutoPrev({
      id: produtoPrev.id, // keep current value
      tamanho: produtoPrev.tamanho, // keep current value
      cor: cores.target.value, // change value <<---------------------
      qtd: produtoPrev.qtd // keep current value
    });
  }
  const mudarTamanho = (tamanhos: React.ChangeEvent<HTMLSelectElement>) => {
    setProdutoPrev({
      id: produtoPrev.id, // keep current value
      tamanho: tamanhos.target.value, // change value <<---------------------
      cor: produtoPrev.cor, // keep current value
      qtd: produtoPrev.qtd // keep current value
    });
  }
  const qtdMenos = () => {
    setProdutoPrev({
      id: produtoPrev.id, // keep current value
      tamanho: produtoPrev.tamanho, // keep current value
      cor: produtoPrev.cor, // keep current value
      qtd: produtoPrev.qtd - 1 // change value <<---------------------
    });
  }
  const qtdMais = () => {
    setProdutoPrev({
      id: produtoPrev.id, // keep current value
      tamanho: produtoPrev.tamanho, // keep current value
      cor: produtoPrev.cor, // keep current value
      qtd: produtoPrev.qtd + 1 // change value <<---------------------
    });
  }

  // Buscar outra forma de fazer isso. Parece muito errado. Eu acho.
  if(produto.id !== '') {
    return (
      <>
        <ItemNome id="nomeAlt">{produto.nome}</ItemNome>

        <AlterItemImgDiv>
          {produtoPrev.cor !== '' && <AlterItemImg id="imgAlt" src={require(`../img/produto/${produto.id}/${produto.id}_${produtoPrev.cor}.png`)} alt={produto.nome} />}
        </AlterItemImgDiv>

        <AlterItemInfo>

          <Quantidade>
            <QtdBox>
              {produtoPrev.qtd < 2 ? <BtnMaisMenos disabled id="BtnDisabled" >-</BtnMaisMenos> : <BtnMaisMenos onClick={() => qtdMenos()}>-</BtnMaisMenos>}
              <QtdNum>{produtoPrev.qtd}</QtdNum>
              <BtnMaisMenos  onClick={() => qtdMais()}>+</BtnMaisMenos>
            </QtdBox>
          </Quantidade>

          <Select id="cores" name="cores" onChange={mudarCor} >
            <Option key="0" value="" >Cor</Option>
            {produto.cor.map((corOption) => {
              const cap = corOption.charAt(0).toUpperCase(); // Capitalizar primeira letra
              const rest = corOption.substring(1); // pegar conteudo restante a partir da posicao 1 da string
              return (
                <Option key={corOption} value={corOption} >{`${cap}${rest}`}</Option>
              )
            })}
          </Select>

          <Select id="tamanhos" name="tamanhos" onChange={mudarTamanho}>
            <Option key="0" value="" >Tamanho</Option>
            {produto.tamanho.map((tamanhoOption) => {
              const cap = tamanhoOption.charAt(0).toUpperCase(); // Capitalizar primeira letra
              const rest = tamanhoOption.substring(1); // pegar conteudo restante a partir da posicao 1 da string
              return (
                <Option key={tamanhoOption} value={tamanhoOption} >{`${cap}${rest}`}</Option>
              )
            })}
          </Select>

        </AlterItemInfo>

        <PrecoAlterarContainer>
        
          <Preco id="precoAlt">R$ {converterPreco(produto.preco * produtoPrev.qtd)}</Preco>

          {btnWait? (
            <AlterItemConfirmarBtn id="altBtn" onClick={ altItem } style={{ backgroundColor: '#242424', cursor: 'auto' }}>load gif</AlterItemConfirmarBtn>
          ) : (
            <AlterItemConfirmarBtn id="altBtn" onClick={ altItem }>Alterar</AlterItemConfirmarBtn>
          )}

        </PrecoAlterarContainer>

      </>
    )
  } else {
    // throw error
  }
}

const ItemNome = styled.p`
  margin: 0;
  margin-top: 10px;
  margin-bottom: 5px;
  font-family: var(--main-font);
  font-size: 20px;
  font-weight: 400;
  padding-left: 15px;
  padding-right: 15px;
`

const AlterItemImgDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const AlterItemImg = styled.img`
  height: 300px;
`

const AlterItemInfo = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  column-gap: 15px;
  justify-content: center;
  align-items: center;
`

const Box = styled.div`
  height: 42px;
  aspect-ratio: 1 / 1;
  background: rgba(0,0,0);
`

const Quantidade = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  column-gap: 10px;
`
const QtdBox = styled.div`
  display: flex;
  height: 42px;
  border: 1px solid #909090;
`
const BtnMaisMenos = styled.button`
  width: 40px;
  background: none;
  border: none;
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
const Select = styled.select`
  height: 42px;
  border: 1px solid #909090;
  font-size: 15px;
`
const Option = styled.option`
`

const PrecoAlterarContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  column-gap: 15px;
  justify-content: center;
  align-items: center;
`
const Preco = styled.p`
  margin: 0;
  font-family: var(--main-font);
  font-size: 22px;
  font-weight: 400;
`
const AlterItemConfirmarBtn = styled.button`
  width: 220px;
  background-color: black;
  padding: 15px;
  padding-left: 35px;
  padding-right: 35px;
  border-radius: 4px;
  border: none;
  font-family: var(--main-font);
  font-size: 18px;
  color: white;
  cursor: pointer;
`
