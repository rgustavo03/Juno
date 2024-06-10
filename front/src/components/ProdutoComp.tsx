
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import "../css/home.css";
import { converterPreco } from "../functions/ConverterPreco";

type produtoTipo = {
  id_prod: string,
  nome: string,
  preco: number,
  tipo: string,
  tamanho: string[],
  cores: string[]
}

export const ProdutoComp = (p: produtoTipo, i: number) => {
  // useState change color on mouseOver
  return (
    <Link to={`/produto/${p.id_prod}`} style={{ textDecoration: 'none' }}>
      <Produto key={i} id="produto">
        <ProdutoImg id="produtoImg" src={require(`../img/produto/${p.id_prod}/${p.id_prod}_${p.cores[0]}_low.png`)} alt={p.nome} />
        <ProdutoTitulo id="produtoTitulo">{p.nome}</ProdutoTitulo>
        <ProdutoPreco id="produtoPreco">R$ {converterPreco(p.preco)}</ProdutoPreco>
        <ProdutoCores id="produtoCores">
          {p.cores.map( (c, j) => (
            <OpcaoCor id="opcaoCor" key={j}>
              <ImgCor src={require(`../img/produto/${p.id_prod}/${c}.png`)} alt={c} loading="lazy" />
            </OpcaoCor>
          ))}
        </ProdutoCores>
      </Produto>
    </Link>
  )
}


const Produto = styled.a`
  width: 275px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 5px;
  text-decoration: none;
  color: black;
  position: relative;
`
const ProdutoImg = styled.img`
  height: 250px;
  max-width: 100%;
`
const ProdutoTitulo = styled.h3`
  margin: 0;
  font-size: 19px;
  font-weight: 500;
`
const ProdutoPreco = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 4px;
`

const ProdutoCores = styled.div`
  position: absolute;
  width: 30px;
  top: 0;
  right: 0;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  row-gap: 4px;
  padding-top: 4px;
  padding-bottom: 4px;
`
const OpcaoCor = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  aspect-ratio : 1 / 1;
  height: 22px;
  overflow: hidden;
  border: 1px solid #969696;
`
const ImgCor = styled.img`
  height: 100%;
`