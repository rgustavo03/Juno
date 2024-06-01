import { styled } from "styled-components";
import '../css/home.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useEffect, useState } from "react";
import axios from "axios";

import { ProdutoComp } from "../components/ProdutoComp";

type produto = {
  id_prod: string,
  nome: string,
  preco: number,
  tipo: string,
  tamanho: string, // array escrito em forma de string
  cor: string // array escrito em forma de string
}

type produtoCompProp = {
  id_prod: string,
  nome: string,
  preco: number,
  tipo: string,
  tamanho: string[],
  cores: string[]
}


export function Home() {

  const banners: number[] = [1,2,3,4,5];
  const [poster, setPoster] = useState<number>(1);
  const [arrastar, setArrastar] = useState<boolean>(true);

  const clickOpc = (b: number) => {
    setPoster(b);
    setArrastar(false);
  }

  const movePoster = () => {
    if(!arrastar) return

    //if(poster + 1 == 6) {
    if(poster + 1 == banners.length + 1) {
      setPoster(1);
    } else {
      if(poster == 1) {
        setPoster(2);
      } else {
        setPoster(p => p + 1);
      }
    }

  }

  useEffect(() => {
    let timer = setTimeout(movePoster, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [poster]);


  //--------------------------------

  const [torco, setTorco] = useState<produto[]>([]);
  const [perna, setPerna] = useState<produto[]>([]);
  const [terno, setTerno] = useState<produto[]>([]);
  const [acessorio, setAcessorio] = useState<produto[]>([]);

  const getProdutos = async (tipo: string) => {
    axios.get("http://localhost:3001/produtos", {
      params: { tipo: tipo }
    })
    .then(response => {
      tipo === 'torço' && setTorco(response.data)
      tipo === 'perna' && setPerna(response.data)
      tipo === 'terno' && setTerno(response.data)
      tipo === 'acessório' && setAcessorio(response.data)
    })
    .catch(error => {
      console.log(error);
    })
  }

  getProdutos('torço');
  getProdutos('perna');
  getProdutos('terno');
  getProdutos('acessório');


  //--------------------------------

  const showTorco = torco.map(({id_prod, nome, tipo, preco, tamanho, cor}, i) => {
    const prod: produtoCompProp = {
      id_prod: id_prod,
      nome: nome,
      preco: preco,
      tipo: tipo,
      tamanho: JSON.parse(tamanho),
      cores: JSON.parse(cor)
    }
    return (
      <>{ProdutoComp(prod, i)}</>
    )
  });

  //--------------------------------

  const showPerna = perna.map(({id_prod, nome, tipo, preco, tamanho, cor}, i) => {
    const prod: produtoCompProp = {
      id_prod: id_prod,
      nome: nome,
      preco: preco,
      tipo: tipo,
      tamanho: JSON.parse(tamanho),
      cores: JSON.parse(cor)
    }
    return (
      <>{ProdutoComp(prod, i)}</>
    )
  });

  //--------------------------------

  const showTerno = terno.map(({id_prod, nome, tipo, preco, tamanho, cor}, i) => {
    const prod: produtoCompProp = {
      id_prod: id_prod,
      nome: nome,
      preco: preco,
      tipo: tipo,
      tamanho: JSON.parse(tamanho),
      cores: JSON.parse(cor)
    }
    return (
      <>{ProdutoComp(prod, i)}</>
    )
  });

  //--------------------------------

  const showAcessorio = acessorio.map(({id_prod, nome, tipo, preco, tamanho, cor}, i) => {
    const prod: produtoCompProp = {
      id_prod: id_prod,
      nome: nome,
      preco: preco,
      tipo: tipo,
      tamanho: JSON.parse(tamanho),
      cores: JSON.parse(cor)
    }
    return (
      <>{ProdutoComp(prod, i)}</>
    )
  });

  //--------------------------------


  return (
    <HomePage>

      {/*------ HEADER ------*/}
      <Header />

        <Poster id="poster">
          {banners.map(b => {
            //
            return (
              <PosterImg style={{ display: b == poster ? 'inline' : 'none'}} src={require(`../img/poster/${b}.jpg`)} />
            )
          })}
          <PosterOpcContainer id="posterOpcContainer">
            {banners.map(b => {
              //
              return (
                <PosterOpc className="posterOpc"
                  style={{ backgroundColor: b == poster ? 'white' : 'rgba(255,255,255,0.3)' }}
                  onClick={() => clickOpc(b)}
                ></PosterOpc>
              )
            })}
          </PosterOpcContainer>
        </Poster>

        <ListaCamisas id="lista">
        <ListaTitulo id="listaTitulo">Camisetas, Blusas e Moletons</ListaTitulo>
          <ListaProdutos>
            {/*------ Array de produtos ------*/}
            {torco.length != 0 && showTorco}
          </ListaProdutos>
        </ListaCamisas>
        
        <ListaCalcas id="lista">
        <ListaTitulo id="listaTitulo">Calças, Shorts e Bermudas</ListaTitulo>
          <ListaProdutos>
            {perna.length != 0 && showPerna}
          </ListaProdutos>
        </ListaCalcas>

        <ListaCalcas id="lista">
        <ListaTitulo id="listaTitulo">Ternos, Roupas formais</ListaTitulo>
          <ListaProdutos>
            {terno.length != 0 && showTerno}
          </ListaProdutos>
        </ListaCalcas>

        <ListaCalcas id="lista">
        <ListaTitulo id="listaTitulo">Calças, Shorts e Bermudas</ListaTitulo>
          <ListaProdutos>
            {acessorio.length != 0 && showAcessorio}
          </ListaProdutos>
        </ListaCalcas>

      {/*------ FOOTER ------*/}
      <Footer />

    </HomePage>
  );
}


const HomePage = styled.section`
  font-family: var(--main-font);
  background-color: #f7f7f7;
`;

const Poster = styled.div`
  position: relative;
  height: 315px;
  width: auto;
  background-color: rgb(0, 0, 0);
  margin-bottom: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
const PosterImg = styled.img`
  height: 100%;
`
const PosterOpcContainer = styled.div`
  position: absolute;
  bottom: 10px;
  height: 20px;
  width: 200px;
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0,0,0,0.3);
  border-radius: 3px;
`
const PosterOpc = styled.div`
  height: 16px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  cursor: pointer;
`




const Lista = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-bottom: 5px;
  position: relative;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 35px
`;
const ListaCalcas = styled(Lista)`
`;
const ListaCamisas = styled(Lista)`
`;
const ListaTitulo = styled.h2`
  margin: 0;
  padding-top: 5px;
  padding-bottom: 10px;
  font-size: 20px;
  font-weight: 500;
`
const ListaProdutos = styled.div`
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: row;
  column-gap: 15px;
  scroll-behavior: smooth;
  padding-bottom: 7px;

  &::-webkit-scrollbar {
    height: 7px;
  }
  /* Track */
  &::-webkit-scrollbar-track {
    border: none;
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: rgb(180, 180, 180);
    border-radius: 10px;
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: rgb(160, 160, 160);
  }
`
