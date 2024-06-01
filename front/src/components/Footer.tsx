import { styled } from "styled-components"

const TagFooter = styled.section`
  border-top: 1px solid #cacaca;
  width: auto;
  display: flex;
  justify-content: left;
  padding-bottom: 40px;
  background-color: white;
`;

const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding: 20px;
`
const FooterLeftTitulo = styled.p`
  margin: 0;
  font-size: 25px
`
const FooterLeftEmail = styled.a`
  font-size: 17px
`
const FooterMid = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`
const FooterMidItem = styled.p`
  margin: 0;
  text-decoration: none;
  color: black;
  font-size: 16px;
`


export function Footer() {
  return (
    <TagFooter>
      <FooterLeft>
        <FooterLeftTitulo>Juno</FooterLeftTitulo>
        <FooterLeftEmail>juno@email.com</FooterLeftEmail>
      </FooterLeft>
      <FooterMid>
        <FooterMidItem>Carreiras</FooterMidItem>
        <FooterMidItem>Parcerias</FooterMidItem>
        <FooterMidItem>Regulações</FooterMidItem>
      </FooterMid>
    </TagFooter>
  );
}