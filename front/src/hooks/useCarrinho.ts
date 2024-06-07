import { useContext, useState } from "react"
import { UserContext } from "../contexts/UserContext";

interface itemFormato {
  id: string,
  cor: string,
  tamanho: string,
  qtd: number,
}

type itemCart = {
  id: string,
  cor: string,
  tamanho: string,
  qtd: number,
}

type funcBoolean = (a: boolean) => void;

type setItemType = (a: itemFormato) => void;


//                          key eh o nome dado ao carrinho no localStorage
export const useCarrinho = (key: string) => {

  // define array igual ao que estah no localStorage -> se localStorage vazio: cartStorage = null
  const [cartStorage, setCartStorage] = useState<itemFormato[]>(JSON.parse(localStorage.getItem(key) || '[]'));

  const { cartProv, setCartProv } = useContext(UserContext);


  /****************************************************************************************/
  /****************************************************************************************/

  const [check, setCheck] = useState<boolean>(false);

  const checkInCarrinho = (itemCheck: itemFormato) => {

    if(!cartStorage) { // cartStorage ainda nao criado
      return false
    }

    const itemFound:boolean = cartStorage.some(item => {
      if(item.id === itemCheck.id && item.tamanho === itemCheck.tamanho && item.cor === itemCheck.cor) {
        return true
      }
      else {
        return false
      }
    });
    return itemFound
    
  }

  /****************************************************************************************/
  /****************************************************************************************/

  const getCarrinho = () => {
    return cartStorage
  }

  /****************************************************************************************/
  /****************************************************************************************/

  const getQtdCarrinho = () => {

    if(cartProv) {
      return cartProv.length
    } else {
      return 0
    }
  }

  /****************************************************************************************/
  /****************************************************************************************/

  const addCarrinho = (itemAlt: itemFormato) => {

    // criar array com formato definido na interface
    let cart: itemCart[] = JSON.parse(localStorage.getItem(key) || '[]');

    if(checkInCarrinho(itemAlt)) { // se o item ja estiver no cartStorage
      // apenas alterar a quantidade - qtd anterior + nova qtd
      const newCart: itemCart[] = cart.map(cartItem => {
        if (cartItem.id === itemAlt.id && cartItem.tamanho === itemAlt.tamanho && cartItem.cor === itemAlt.cor) {
          return {
            id: cartItem.id,
            cor: cartItem.cor,
            tamanho: cartItem.tamanho,
            qtd: cartItem.qtd + itemAlt.qtd
          }
        }
        else {
          return cartItem
        }
      });
      setCartStorage(newCart);
      // adiciona o array no localStorage:cartStorage
      window.localStorage.setItem(key, JSON.stringify(newCart));
      cart = newCart;
    }
    else { // add normalmente
      cart.push(itemAlt);
      setCartStorage(cart);
      // adiciona o array no localStorage:cartStorage
      window.localStorage.setItem(key, JSON.stringify(cart));
    }
    
    setCartProv(cart); // definir Carrinho-cartProv- com novos dados CONCLUIR
    //-----------------------------------------------------------------------
  }

  /****************************************************************************************/
  /****************************************************************************************/

  // acessível da pagina carrinho
  const removerCarrinho = (item: itemCart) => {

    const cartUpdate = cartProv.filter(cartItem => 
      JSON.stringify(cartItem) !== JSON.stringify(item)
    );

    setCartProv(cartUpdate);

    window.localStorage.setItem(key, JSON.stringify(cartUpdate));

  }

  /****************************************************************************************/
  /****************************************************************************************/

  const alterItemCarrinho = (itemAlt: itemFormato, indexAlt: number, setAlter: funcBoolean, setBtnWait: funcBoolean, setProdutoPrev: setItemType) => {

    // cartProv, setCartProv

    const cartUpdate = cartProv.map((item, i) => {
      if (item.id === itemAlt.id && i === indexAlt) {
        //console.log('index cart:',i);
        return {
          id: item.id,
          cor: itemAlt.cor === '' ? item.cor : itemAlt.cor, // se vem com valor vazio, mantenha o anterior           |
          tamanho: itemAlt.tamanho === '' ? item.tamanho : itemAlt.tamanho, // senao, coloque o novo                 |
          qtd: isNaN(itemAlt.qtd) ? item.qtd : itemAlt.qtd // mesmo if else, porem, nesse caso, se valor vazio = NaN V
        };
      }
      return item;
    });
    
    window.localStorage.setItem(key, JSON.stringify(cartUpdate)); // alterar cartStorage no localStorage

    setCartProv(cartUpdate); // alterar cart na pagina Carrinho

    setAlter(false); // tela de alteracao sumir

    setBtnWait(false); // butao de alterar volta normal

    setProdutoPrev({id: '', cor: '', tamanho: '', qtd: NaN}); // limpra item de mudanca

    /*
    try {
      setCartStorage(cartUpdate);
      window.localStorage.setItem(key, JSON.stringify(cartUpdate));
    } catch(error) {
      // desfazer alteracao item. retornar
    }
    */
  }

  /****************************************************************************************/
  /****************************************************************************************/

  // acessível da pagina carrinho
  const limparCarrinho = () => {

    setCartProv([]);

    window.localStorage.setItem(key, JSON.stringify([]));
    
  }

  return { check, checkInCarrinho, getCarrinho, getQtdCarrinho, addCarrinho, removerCarrinho, alterItemCarrinho, limparCarrinho }
}
