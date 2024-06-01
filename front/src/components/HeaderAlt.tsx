import '../App.css';
import '../css/header.css'
import { Link } from "react-router-dom";
import { styled } from "styled-components"


export function HeaderAlt() {

  return (
    <TagHeader id="header">
      
      <Logo>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <LogoLink>JUNO</LogoLink>
        </Link>
      </Logo>

    </TagHeader>
  );
}


const TagHeader = styled.header`
  height: 80px;
  width: auto;
  background-color: white;
  border-bottom: 1px solid #cacaca;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 20px;
  font-family: var(--main-font);
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LogoLink = styled.a`
  text-decoration: none;
  font-size: 33px;
  color: black;
`;
