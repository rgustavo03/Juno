export function converterPreco(valor: number) {

  let precoString:string = '';

  if(valor < 100000) {
    // converter valor:number para string para slice
    let valorString = valor.toString();
    // casa do real
    let real = valorString.slice(0,-2);
    // casa dos centavos
    let centavos = valorString.slice(-2);
    // string pronta sem o "R$"
    precoString = `${real},${centavos}`;
  }

  if(valor >= 100000) {
    // converter valor:number para string para slice
    let valorString = valor.toString();
    // cada so milhar
    let milhar = valorString.slice(0,-5);
    // casa do real
    let real = valorString.slice(-5,-2);
    // casa dos centavos
    let centavos = valorString.slice(-2);
    // string pronta sem o "R$"
    precoString = `${milhar}.${real},${centavos}`;
  }
    
  return precoString;
}