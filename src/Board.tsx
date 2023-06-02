import React from 'react'
import styled from 'styled-components'

export default function Board() {
    const grid=new Array(3**2).fill(null)
  return (
    <Container>
        {grid.map(()=>{

        
        return(
            <Square>
{'X'}
            </Square>
        )
        })}
    </Container>
  )
}

const Container=styled.div`
display:flex;
justify-content:center;
width:315px;
flex-flow:wrap;
position:relative;
`
const Square=styled.div`
display:flex;
justify-content:center;
align-items:center;
width:100px;
height:100px;
border:1px solid green;
`