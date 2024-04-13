import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #92fee6;
    color: white;
    font-family: 'Inter';
}

#root {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    max-height: 100vw;
    width: 100%;
}
`;

export default GlobalStyle;
