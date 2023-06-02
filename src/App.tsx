import React from 'react';
import Board from './Board';
import styled from 'styled-components';
import './App.css';

function App() {
  return (
   <Main>
    <Board/>
   </Main>
  );
}

const Main=styled.main`
display:flex;
justify-content:center;
align-items:center;

`

export default App;
