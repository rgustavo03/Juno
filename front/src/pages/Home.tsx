import { styled } from "styled-components";
import '../css/home.css';
import { HeaderHome } from "../components/HeaderHome";
import { Footer } from '../components/Footer';
import { useEffect, useMemo, useState } from "react";
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

  const banners: number[] = useMemo(() => [1,2,3], []);
  const [poster, setPoster] = useState<number>(1);
  const [arrastar, setArrastar] = useState<boolean>(true);

  const clickOpc = (b: number) => {
    setPoster(b);
    setArrastar(false);
  }

  useEffect(() => {
    let timer = setTimeout(() => {
      if(!arrastar) return

      if(poster + 1 === banners.length + 1) {
        setPoster(1);
      } else {
        if(poster === 1) {
          setPoster(2);
        } else {
          setPoster(p => p + 1);
        }
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [poster, arrastar, banners]);

  //--------------------------------

  const [torso, setTorso] = useState<produto[]>([]);
  const [perna, setPerna] = useState<produto[]>([]);
  const [terno, setTerno] = useState<produto[]>([]);
  const [acessorio, setAcessorio] = useState<produto[]>([]);

  useEffect(() => {
    const getProdutos = (tipo: string) => {
      axios.get("http://localhost:3001/produtos", {
        params: { tipo: tipo }
      })
      .then(response => {
        tipo === 'torso' && setTorso(response.data)
        tipo === 'perna' && setPerna(response.data)
        tipo === 'terno' && setTerno(response.data)
        tipo === 'acessório' && setAcessorio(response.data)
      })
      .catch(error => {
        console.log(error);
      })
    }
    getProdutos('torso');
    getProdutos('perna');
    getProdutos('terno');
    getProdutos('acessório');
  }, []);

  //--------------------------------

  const showTorso = torso.map(({id_prod, nome, tipo, preco, tamanho, cor}, i) => {
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

  const arrastarLista = (dir: string, lista: string) => {
    const arrastar = document.getElementById(lista);
    if(dir === 'left') {
      if(arrastar) arrastar.scrollLeft -= 1145;
    }
    else if (dir === 'right') {
      if(arrastar) arrastar.scrollLeft += 1145;
    }
  }


  return (
    <HomePage>

      {/*------ HEADER ------*/}
      <HeaderHome />

        <Poster id="poster">
          {banners.map(b => {
            //
            return (
              <PosterImg style={{ display: b === poster ? 'inline' : 'none'}} src={require(`../img/poster/${b}.jpg`)} />
            )
          })}
          <PosterOpcContainer id="posterOpcContainer">
            {banners.map(b => {
              //
              return (
                <PosterOpc className="posterOpc"
                  style={{ backgroundColor: b === poster ? 'white' : 'rgba(255,255,255,0.3)' }}
                  onClick={() => clickOpc(b)}
                ></PosterOpc>
              )
            })}
          </PosterOpcContainer>
        </Poster>

        <ListaCamisas id="lista">
          <ListaTitulo id="listaTitulo">Camisetas, Blusas e Moletons</ListaTitulo>
          <ListaProdutos>
            <ListaBtn id="listaBtn" onClick={() => arrastarLista('left', 'torso')}>
              <BtnArrow src={require(`../components/icons/arrow-left.png`)} style={{ marginRight: '4px' }}/>
            </ListaBtn>
            <Produtos id="torso">
              {torso.length !== 0 && (
                torso.map(({id_prod, nome, tipo, preco, tamanho, cor}, i) => {
                  const prod: produtoCompProp = {
                    id_prod: id_prod,
                    nome: nome,
                    preco: preco,
                    tipo: tipo,
                    tamanho: JSON.parse(tamanho),
                    cores: JSON.parse(cor)
                    }
                  return <>{ProdutoComp(prod, i)}</>                  
                })
              )}
            </Produtos>
            <ListaBtn id="listaBtn" onClick={() => arrastarLista('right', 'torso')}>
              <BtnArrow src={require(`../components/icons/arrow-right.png`)} style={{ marginLeft: '4px' }}/>
            </ListaBtn>
          </ListaProdutos>
        </ListaCamisas>
        
        <ListaCalcas id="lista">
        <ListaTitulo id="listaTitulo">Calças, Shorts e Bermudas</ListaTitulo>
          <ListaProdutos>
            /
          </ListaProdutos>
        </ListaCalcas>

        <ListaCalcas id="lista">
        <ListaTitulo id="listaTitulo">Ternos, Roupas formais</ListaTitulo>
          <ListaProdutos>
            /
          </ListaProdutos>
        </ListaCalcas>

        <ListaCalcas id="lista">
        <ListaTitulo id="listaTitulo">Calças, Shorts e Bermudas</ListaTitulo>
          <ListaProdutos>
            /
          </ListaProdutos>
        </ListaCalcas>

      {/*------ FOOTER ------*/}
      <Footer />

    </HomePage>
  );
}



const HomePage = styled.section`
  font-family: var(--main-font);
`;

const Poster = styled.div`
  position: relative;
  z-index: 1;
  height: 475px;
  width: auto;
  background-color: rgb(0, 0, 0);
  margin-bottom: 15px;
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
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  column-gap: 15px;
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
  margin-bottom: 30px;
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
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  justify-content: center;
  align-items: center;
`
const ListaBtn = styled.div`
  background-color: rgba(230,230,230,0.9);
  height: 50px;
  aspect-ratio : 1 / 1;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
const BtnArrow = styled.img`
  height: 35%;
`
const Produtos = styled.div`
  max-width: 1145px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: row;
  column-gap: 15px;
  scroll-behavior: smooth;
`



const B = styled.div`
  margin-top: 50px;
  width: 100%;
  height: 600px;
  background: rgb(106,8,8);
  background: linear-gradient(140deg, rgba(106,8,8,1) 0%, rgba(83,8,8,1) 22%, rgba(41,0,0,1) 100%);
  background: rgb(120,23,23);
  background: linear-gradient(140deg, rgba(120,23,23,1) 0%, rgba(82,13,13,1) 36%, rgba(42,0,0,1) 100%);
  background: rgb(41,111,111);
  background: linear-gradient(140deg, rgba(41,111,111,1) 0%, rgba(15,79,79,1) 20%, rgba(6,27,27,1) 100%);
`