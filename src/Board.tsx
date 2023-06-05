import React,{useState} from 'react'
import styled from 'styled-components'

const grid=new Array(3**2).fill(null)
const player_x=1;
const player_0=2;

export default function Board() {
const [newGrid,setNewGrid]=useState(grid);
const [players,setPlayers]=useState({
    human:player_x,
    computer:player_0
})
const move = (index: number, player: number ) => {
    setNewGrid((newGrid) => {
      const gridCopy = newGrid.concat();
      gridCopy[index] = player;
      return gridCopy;
    });
  };

const computerMove=()=>{
    let index=Math.floor(Math.random()*9)
    while(newGrid[index]){
     index=Math.floor(Math.random()*9)
    }
    move(index,players.computer)
}

const humanMove=(index:number)=>{
    if(!newGrid[index]){
     move(index,players.human)
     computerMove()
      }
}
  return (
    <Container>
        {newGrid.map((value,index)=>{
const isActive=value !== null;
       return(
            <Square key={index} onClick={()=>humanMove(index)}>
{isActive && <Marker>{value===player_x ? "x" : "o"}</Marker> }
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
const Marker=styled.p`
font-size:68px;
`