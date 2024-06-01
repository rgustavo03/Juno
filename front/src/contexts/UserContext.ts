import { createContext } from "react";

type userType = {
  id: string,
  email: string,
  nome: string
}

type itemCart = {
  id: string,
  cor: string,
  tamanho: string,
  qtd: number,
}

interface contextInterface {
  user: userType,
  setUser: (a: userType) => void,
  logged: boolean,
  setLogged: (a: boolean) => void,
  cartProv: itemCart[],
  setCartProv: (a: itemCart[]) => void
}

export const UserContext = createContext<contextInterface>({} as contextInterface);