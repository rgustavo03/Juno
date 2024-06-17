import { styled } from "styled-components";
import '../css/home.css';
import { Link } from "react-router-dom";
import { HeaderHome } from "../components/HeaderHome";
import { Footer } from '../components/Footer';
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import { ProdutoComp } from "../components/ProdutoComp";
import buildings from "../img/produto/bw-buildings.jpg";

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

  const homePage = useRef() as React.MutableRefObject<HTMLDivElement>;

  const arrastarLista = (dir: string, id: string) => {
    const widthPage = homePage.current.offsetWidth;
    const lista = document.getElementById(id);
    let arrastar = NaN;

    if(widthPage > 1300) arrastar = 290 * 4
    if(widthPage > 1160 && widthPage <= 1300) arrastar = 260 * 4
    if(widthPage > 950 && widthPage <= 1160) arrastar = 265 * 3
    if(widthPage > 885 && widthPage <= 950) arrastar = 246 * 3
    if(widthPage > 690 && widthPage <= 885) arrastar = 275 * 2
    if(widthPage > 615 && widthPage <= 690) arrastar = 245 * 2
    if(widthPage > 530 && widthPage <= 615) arrastar = 241 * 2
    if(widthPage <= 530) arrastar = 225 * 2
    
    if(dir === 'left') {
      if(lista) lista.scrollLeft -= arrastar;
    }
    else if (dir === 'right') {
      if(lista) lista.scrollLeft += arrastar;
    }
  }


  return (
    <HomePage ref={homePage}>

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

        <Lista id="lista">
          <ListaTitulo id="listaTitulo">Camisetas, Blusas e Moletons</ListaTitulo>
          <ListaProdutos id="listaProdutos">
            <ListaBtn id="listaBtnLeft" onClick={() => arrastarLista('left', 'torso')}>
              <BtnArrow src={require(`../components/icons/arrow-left.png`)} style={{ marginRight: '4px' }}/>
            </ListaBtn>
            <Produtos id="torso">
              {/*---- Array de Produtos ----*/}
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
                  return <Link to={`/produto/${id_prod}`}>{ProdutoComp(prod, i)}</Link>
                })
              )}
            </Produtos>
            <ListaBtn id="listaBtnRight" onClick={() => arrastarLista('right', 'torso')}>
              <BtnArrow src={require(`../components/icons/arrow-right.png`)} style={{ marginLeft: '4px' }}/>
            </ListaBtn>
          </ListaProdutos>
        </Lista>


        <Lista id="lista">
          <ListaTitulo id="listaTitulo">Calças, Shorts e Bermudas</ListaTitulo>
          <ListaProdutos>
          <ListaBtn id="listaBtnLeft" onClick={() => arrastarLista('left', 'perna')}>
              <BtnArrow src={require(`../components/icons/arrow-left.png`)} style={{ marginRight: '4px' }}/>
            </ListaBtn>
            <Produtos id="perna">
              {/*---- Array de Produtos ----*/}
              {perna.length !== 0 && (
                perna.map(({id_prod, nome, tipo, preco, tamanho, cor}, i) => {
                  const prod: produtoCompProp = {
                    id_prod: id_prod,
                    nome: nome,
                    preco: preco,
                    tipo: tipo,
                    tamanho: JSON.parse(tamanho),
                    cores: JSON.parse(cor)
                  }
                  return <Link to={`/produto/${id_prod}`}>{ProdutoComp(prod, i)}</Link>
                })
              )}
            </Produtos>
            <ListaBtn id="listaBtnRight" onClick={() => arrastarLista('right', 'perna')}>
              <BtnArrow src={require(`../components/icons/arrow-right.png`)} style={{ marginLeft: '4px' }}/>
            </ListaBtn>
          </ListaProdutos>
        </Lista>


        <Lista id="listaTerno" style={{ backgroundImage: `url(${buildings}), linear-gradient(140deg, #0a0a0a 0%, #000000 20%, #272528 100%)` }}>
          <ListaTitulo id="listaTitulo" style={{ color: 'white' }}>Ternos, roupas formais</ListaTitulo>
          <ListaProdutos>
          <ListaBtn id="listaBtnLeft" onClick={() => arrastarLista('left', 'terno')}>
              <BtnArrow src={require(`../components/icons/arrow-left.png`)} style={{ marginRight: '4px' }}/>
            </ListaBtn>
            <Produtos id="terno">
              {/*---- Array de Produtos ----*/}
              {terno.length !== 0 && (
                terno.map(({id_prod, nome, tipo, preco, tamanho, cor}, i) => {
                  const prod: produtoCompProp = {
                    id_prod: id_prod,
                    nome: nome,
                    preco: preco,
                    tipo: tipo,
                    tamanho: JSON.parse(tamanho),
                    cores: JSON.parse(cor)
                  }
                  return <Link to={`/produto/${id_prod}`}>{ProdutoComp(prod, i)}</Link>
                })
              )}
            </Produtos>
            <ListaBtn id="listaBtnRight" onClick={() => arrastarLista('right', 'terno')}>
              <BtnArrow src={require(`../components/icons/arrow-right.png`)} style={{ marginLeft: '4px' }}/>
            </ListaBtn>
          </ListaProdutos>
        </Lista>


        <Lista id="lista">
          <ListaTitulo id="listaTitulo">Acessórios</ListaTitulo>
          <ListaProdutos>
          <ListaBtn id="listaBtnLeft" onClick={() => arrastarLista('left', 'acessorio')}>
              <BtnArrow src={require(`../components/icons/arrow-left.png`)} style={{ marginRight: '4px' }}/>
            </ListaBtn>
            <Produtos id="acessorio">
              {/*---- Array de Produtos ----*/}
              {acessorio.length !== 0 && (
                acessorio.map(({id_prod, nome, tipo, preco, tamanho, cor}, i) => {
                  const prod: produtoCompProp = {
                    id_prod: id_prod,
                    nome: nome,
                    preco: preco,
                    tipo: tipo,
                    tamanho: JSON.parse(tamanho),
                    cores: JSON.parse(cor)
                  }
                  return <Link to={`/produto/${id_prod}`}>{ProdutoComp(prod, i)}</Link>
                })
              )}
            </Produtos>
            <ListaBtn id="listaBtnRight" onClick={() => arrastarLista('right', 'acessorio')}>
              <BtnArrow src={require(`../components/icons/arrow-right.png`)} style={{ marginLeft: '4px' }}/>
            </ListaBtn>
          </ListaProdutos>
        </Lista>

      {/*------ FOOTER ------*/}
      <Footer />

    </HomePage>
  );
}



const HomePage = styled.div`
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
  position: relative;
`
const ListaBtn = styled.div`
  z-index: 2;
  background-color: rgba(251,251,251,0.9);
  height: 50px;
  aspect-ratio : 1 / 1;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: rgb(255,255,255);
  }
`
const BtnArrow = styled.img`
  height: 30%;
`
const Produtos = styled.div`
  z-index: 1;
  max-width: 1145px;
  min-width: 1145px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: row;
  column-gap: 15px;
  scroll-behavior: smooth;
`

/*
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
*/