import '../App.css';
import { useNavigate, useParams, Link } from "react-router-dom";
import styled from "styled-components"
import { HeaderAlt } from "../components/HeaderAlt"
import { RedCheck } from '../components/icons/red-check-icon';
import { useContext, useEffect } from 'react';

import { UserContext } from '../contexts/UserContext';

import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

type FormType = {
  email: string,
  senha: string
}

type irParam = {
  ir: string;
}


export const Entrar = () => {

  let navigate = useNavigate();

  // get parameter MELHORAR
  const { ir } = useParams<irParam>();

  const { setUser, logged, setLogged} = useContext(UserContext);

  useEffect(() => {
    if(logged) {
      navigate(`/${ir}`);
    }
  }, [logged]);

  const schema: ZodType<FormType> = z.object({
    email: z.string().email(),
    senha: z.string()
  });

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormType>({resolver: zodResolver(schema)})

  
  const submitLogin = async (form: FormType) => {

    axios.get("http://localhost:3001/login", {
      params: { email: form.email, senha: form.senha }
    })
    .then(response => {
      if(response.data.r) {
        setUser({
          id: response.data.c.id,
          email: response.data.c.email,
          nome: response.data.c.nome
        });
        setLogged(response.data.r); // logado true
        if(ir === 'home') {
          navigate(`/`);
        }
        else if(ir === 'compra') {
          navigate('/carrinho');
        }
        else {
          navigate(`/${ir}`);
        }
      } else {
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
        <form onSubmit={handleSubmit(submitLogin)}>
        <LogCadContainer>

          <Titulo>Entre {ir === 'compra' && 'para finalizar compra'}</Titulo>

          <DivInput>
            <Input id="email" type="text" placeholder='Email' {...register('email')} /> {/* input */}
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
            <Input id="senha" type='password' placeholder='Senha' {...register('senha')} /> {/* input */}
          </DivInput>

          {errors.root &&
            <ErroLogin>
              {errors.root.message}
            </ErroLogin>
          }

          <ConfimarBtn type="submit">Entrar</ConfimarBtn>

          <Alternate>Não tem conta? <Link to={`../../cadastrar/${ir}`}>Cadastra-te</Link></Alternate>
        </LogCadContainer>
        </form>
      </Pagina>
    </>
  )
}


const Pagina = styled.section`
  height: ${window.innerHeight};
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: top;
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
const ErroLogin = styled.p`
  margin: 0;
  font-size: 17px;
  font-weight: 500;
  color: red;
`
const Alternate = styled.p`
  margin: 0;
`
