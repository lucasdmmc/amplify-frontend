import { createGlobalStyle } from "styled-components";
import backgroundImg from '../images/background.png';


export const GlobalStyle = createGlobalStyle`
  .amplify-button--primary {
    background-color: #8c4599 !important;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
  }

  .amplify-flex .liveness-detector-start {
    background: red;
    background-image: url(${backgroundImg}) !important;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  p.amplify-text {
    /* color: red !important; */
  }

  /* .amplify-flex .amplify-liveness-toast__message {
    color: black !important;
  } */

  /* .amplify-flex .amplify-liveness-instruction-overlay {
    color: red !important;
  } */
`;