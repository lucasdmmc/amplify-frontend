import { createGlobalStyle } from "styled-components";
import backgroundImg from '../images/background.png';


export const GlobalStyle = createGlobalStyle`
  .amplify-button--primary {
    background-color: #46c3cb !important;
    /* color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer; */
    width: 100% !important;
    height: 50px !important;
  }

  .amplify-flex .liveness-detector-start {
    background: white;
    /* background-image: url(${backgroundImg}) !important;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center; */
  }

  .amplify-alert {
    background: #e7c35e !important;
  }
`;
