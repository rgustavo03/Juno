export function getImage(tipo: string, id:string, cor:string) {
  let imgUrl: string = `../db/${tipo}/${id}/${id}_${cor}.png`;
  return imgUrl
}