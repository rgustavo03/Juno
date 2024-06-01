import '../App.css';
import styled from "styled-components"
import { HeaderAlt } from "../components/HeaderAlt"
import { RedCheck } from '../components/icons/red-check-icon';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios';

import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type FormType = {
  nome: string,
  email: string,
  genero: string,
  estado: string,
  cidade: string,
  endereco: string,
  telefone: string,
  senha: string,
  confirmSenha: string
}

type UserType = {
  id: string,
  nome: string
}

type irParam = {
  ir: string;
}


type regiao = {
  id: number,
  sigla: string,
  nome: string
}
type uf = {
  id: number,
  sigla: string,
  nome: string,
  regiao: regiao
}
type mesorregiao = {
  id: number,
  nome: string
  uf: uf
}
type municipio = {
  id: number,
  nome: string,
  mesorregiao: mesorregiao
}


export const Cadastrar = () => {

  const navigate = useNavigate();

  // get parameter MELHORAR
  const { ir } = useParams<irParam>();

  const { setUser, logged, setLogged} = useContext(UserContext);

  useEffect(() => {
    if(logged) {
      navigate(`/${ir}`);
    }
  }, [logged]);


  const [ufs, setUfs] = useState<uf[]>([]); // valores para opcoes, nao vai ao submit
  const [municipios, setMunicipios] = useState<municipio[]>([]); // valores para opcoes, nao vai ao submit

  const [estado, setEstado] = useState<number>(NaN); // id estado para get cidades, nao vai ao submit
  
  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    .then(response => {
      setUfs(response.data);
    })
  },[]);

  function handleChangeUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf: string = event.target.value;
    ufs.map(u => {
      if(u.nome == uf) {
        setEstado(u.id);
      }
    });
  }

  useEffect(() => {
    axios(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
    .then(response => {
      setMunicipios(response.data);
    })
  }, [estado])


  const schema: ZodType<FormType> = z
    .object({
      nome: z.string().min(2).max(300),
      email: z.string().email(),
      genero: z.string().refine(valor => valor !== '...', {
        message: 'Informe o gênero',
      }),
      estado: z.string().refine(valor => valor !== 'Estado', {
        message: 'Selecione o Estado',
      }),
      cidade: z.string().refine(valor => valor !== 'Cidade', {
        message: 'Selecione a cidade',
      }),
      endereco: z.string().min(1).max(400),
      telefone: z.string().min(6).max(20),
      senha: z.string().min(8).max(20),
      confirmSenha: z.string().min(8).max(20)
    })
    .refine((data => data.senha === data.confirmSenha), {
      message: 'Senhas diferentes',
      path: ['confirmSenha'],
    });

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormType>({resolver: zodResolver(schema)})

  const submitCadastrar = async (form: FormType) => {

    axios.post("http://localhost:3001/cadastrar", {
      nome: form.nome,
      email: form.email,
      genero: form.genero,
      estado: form.estado,
      cidade: form.cidade,
      endereco: form.endereco,
      telefone: form.telefone,
      senha: form.senha
    })
    .then(response => {
      if(response.data.r) {
        setUser({
          id: response.data.c.insertId,
          email: form.email,
          nome: form.nome
        });
        setLogged(response.data.r); // Logado true
        // setStorage
        if(ir == 'home') {
          navigate(`/`);
        }
        else if(ir == 'compra') {
          navigate('/carrinho');
        }
        else {
          navigate(`/${ir}`);
        }
      }
      else {
        setError('root', {
          message: response.data.msg
        });
      }
    })
    .catch(error => {
      setError('root', {
        message: error
      });
    });

  }


  return (
    <>
      <HeaderAlt />
      <Pagina style={{ display: logged ? 'none' : 'inline'}}>
        <form onSubmit={handleSubmit(submitCadastrar)}>
        <LogCadContainer>

          <Titulo>Junte-se</Titulo>

          <DivInput>
            <Input type="text" placeholder='Nome' {...register('nome')} />
            {errors.nome &&
              <CheckInput>
                <Check>
                  <RedCheck height='13px' />
                </Check>
                <AvisoDiv>
                  <AvisoText>{errors.nome.message}</AvisoText>
                </AvisoDiv>
              </CheckInput>
            }
          </DivInput>

          <DivInput>
            <Input type="text" placeholder='Email' {...register('email')} />
            {errors.email &&
              <CheckInput>
                <Check>
                  <RedCheck height='13px' />
                </Check>
                <AvisoDiv>
                  <AvisoText>{errors.email.message}</AvisoText>
                </AvisoDiv>
              </CheckInput>
            }
          </DivInput>

          <DivInput>
            <TextSelect>
              <GeneroText>Gênero:</GeneroText>
              <Select {...register('genero')} >
                <Option disabled selected>...</Option>
                <Option value="Homem">Homem</Option>
                <Option value="Mulher">Mulher</Option>
                <Option value="Não binário">Não Binário</Option>
              </Select>
            </TextSelect>
            {errors.genero &&
              <CheckInput>
                <Check>
                  <RedCheck height='13px' />
                </Check>
                <AvisoDiv>
                  <AvisoText>{errors.genero.message}</AvisoText>
                </AvisoDiv>
              </CheckInput>
            }
          </DivInput>

          <DivInput>
            <TextSelect>
              <Select {...register('estado')} onChange={handleChangeUf}>
                <Option disabled selected >Estado</Option>
                {ufs.map(uf => {
                  //capitalizar nome Estado
                  return (
                    <Option key={uf.id} value={uf.nome}>{uf.nome}</Option>
                  )
                })}
              </Select>
            </TextSelect>
            {(errors.estado) &&
              <CheckInput>
                <Check>
                  <RedCheck height='13px' />
                </Check>
                <AvisoDiv>
                  <AvisoText>Selecione o estado</AvisoText>
                </AvisoDiv>
              </CheckInput>
            }
          </DivInput>

          <DivInput>
            <TextSelect>
              <Select {...register('cidade')} >
                <Option disabled selected>Cidade</Option>
                {municipios.map(m => {
                  //capitalizar nome Cidade
                  return (
                    <Option key={m.id} value={m.nome}>{m.nome}</Option>
                  )
                })}
              </Select>
            </TextSelect>
            {(errors.cidade) &&
              <CheckInput>
                <Check>
                  <RedCheck height='13px' />
                </Check>
                <AvisoDiv>
                  <AvisoText>Selecione a cidade</AvisoText>
                </AvisoDiv>
              </CheckInput>
            }
          </DivInput>

          <DivInput>
            <Input type="text" placeholder='Endereço' {...register('endereco')} />
            {errors.endereco &&
              <CheckInput>
                <Check>
                  <RedCheck height='13px' />
                </Check>
                <AvisoDiv>
                  <AvisoText>{errors.endereco.message}</AvisoText>
                </AvisoDiv>
              </CheckInput>
            }
          </DivInput>

          <DivInput>
            <Input type="number" placeholder='Número / Telefone' {...register('telefone')} />
            {errors.telefone &&
              <CheckInput>
                <Check>
                  <RedCheck height='13px' />
                </Check>
                <AvisoDiv>
                  <AvisoText>{errors.telefone.message}</AvisoText>
                </AvisoDiv>
              </CheckInput>
            }
          </DivInput>

          <DivInput>
            <Input type='password' placeholder='Senha' {...register('senha')} />
            {errors.senha &&
              <CheckInput>
                <Check>
                  <RedCheck height='13px' />
                </Check>
                <AvisoDiv>
                  <AvisoText>{errors.senha.message}</AvisoText>
                </AvisoDiv>
              </CheckInput>
            }
          </DivInput>

          <DivInput>
            <Input type='password' placeholder='Confirmar senha' {...register('confirmSenha')} />
            {errors.confirmSenha &&
              <CheckInput>
                <Check>
                  <RedCheck height='13px' />
                </Check>
                <AvisoDiv>
                  <AvisoText>{errors.confirmSenha.message}</AvisoText>
                </AvisoDiv>
              </CheckInput>
            }
          </DivInput>

          {errors.root && 
            <DivInput>
              {errors.root.message}
            </DivInput>
          }

          <ConfimarBtn type="submit">Cadastrar</ConfimarBtn>

          <Alternate>Já tem conta? <Link to={`../../entrar/${ir}`}>Entre</Link></Alternate>
        </LogCadContainer>
        </form>
      </Pagina>
    </>
  )
}


const Pagina = styled.section`
  height: auto;
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: top;
  padding-bottom: 100px;
  font-family: var(--main-font);
`
const LogCadContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 120px;
  padding-left: 40px;
  padding-right: 40px;
`
const Titulo = styled.h4`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`
const DivInput = styled.div`
  position: relative;
`
const Input = styled.input`
  height: 45px;
  width: 300px;
  font-size: 17px;
  padding-left: 7px;
  padding-right: 7px;
`
const CheckInput = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  height: 100%;
  min-width: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 7px;
`
const Check = styled.div`
  width: 40px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const AvisoDiv = styled.div`
  height: 80%;
  width: auto;
  border: 1px solid #212121;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
`
const AvisoText = styled.p`
  margin: 0;
  font-size: 15px;
`
const TextSelect = styled.div`
  height: 45px;
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  justify-content: center;
  align-items: center;
`
const GeneroText = styled.p`
  margin: 0;
  font-size: 17px;
  flex: 1;
`
const Select = styled.select`
  height: 100%;
  flex: 1;
  font-size: 16px;
  padding-left: 10px;
  padding-right: 10px;
`
const Option = styled.option`
  height: 45px;
  font-size: 16px;
  padding-left: 10px;
  padding-right: 10px;
`
const ConfimarBtn = styled.button`
  margin-top: 10px;
  height: 45px;
  width: 319px;
  background-color: black;
  color: white;
  font-size: 17px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`
const Alternate = styled.p`
  margin: 0;
`
