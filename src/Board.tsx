import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Deck from "./Deck";

const board = new Deck();

const grid = new Array(3 ** 2).fill(null);
const player_x = 1;
const player_0 = 2;
const draw = 0;
const game_status = {
  in_progres: "in_progess",
  choose_player: "choose_player",
  over: "over",
};

export default function Board() {
  const [newGrid, setNewGrid] = useState(grid);
  const [players, setPlayers] = useState<Record<string, number | null>>({
    human: null,
    computer: null,
  });
  const [gameStatus, setGameStatus] = useState(game_status.choose_player);
  const [nextMove, setNextMove] = useState<null | number>(null);
  const [winner, setWinner] = useState<null | string>(null);

  useEffect(() => {
    const boardWinner = board.calculateWinner(newGrid);
    const declareWinner = (winner: number) => {
      let winnerStr = "";
      switch (winner) {
        case player_x:
          winnerStr = "Player X wins!";
          break;
        case player_0:
          winnerStr = "Player O wins!";
          break;
        case draw:
        default:
          winnerStr = "It's a draw";
      }
      setGameStatus(game_status.over);
      setWinner(winnerStr);
    };

    if (boardWinner !== null && gameStatus !== game_status.over) {
      declareWinner(boardWinner);
    }
  }, [gameStatus, newGrid, nextMove]);

  const switchPlayer = (player: number) => {
    return player === player_x ? player_0 : player_x;
  };

  const selectPlayer = (option: number) => {
    setPlayers({ human: option, computer: switchPlayer(option) });
    setGameStatus(game_status.in_progres);
    setNextMove(player_x);
  };
  const move = useCallback(
    (index: number, player: number | null) => {
      if (player && gameStatus === game_status.in_progres) {
        setNewGrid((newGrid) => {
          const gridCopy = newGrid.concat();
          gridCopy[index] = player;
          return gridCopy;
        });
      }
    },
    [gameStatus]
  );

  const computerMove = useCallback(() => {
    let index = Math.floor(Math.random() * 9);
    while (newGrid[index]) {
      index = Math.floor(Math.random() * 9);
    }
    move(index, players.computer);
    setNextMove(players.human);
  }, [move, newGrid, players]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (
      nextMove !== null &&
      nextMove === players.computer &&
      gameStatus !== game_status.over
    ) {
      timeout = setTimeout(() => {
        computerMove();
      }, 500);
    }
    return () => timeout && clearTimeout(timeout);
  }, [nextMove, computerMove, players.computer, gameStatus]);

  const humanMove = (index: number) => {
    if (!newGrid[index]) {
      move(index, players.human);
      setNextMove(players.computer);
    }
  };
  const newGame = () => {
    setGameStatus(game_status.choose_player);
    setNewGrid(grid);
  };
  switch (gameStatus) {
    case game_status.choose_player:
    default:
      return (
        <div>
          <Paragraph>
            <p>Choose player</p>
            <Row>
              <button onClick={() => selectPlayer(player_x)}>X</button>
              <button onClick={() => selectPlayer(player_0)}>0</button>
            </Row>
          </Paragraph>
        </div>
      );
    case game_status.in_progres:
      return (
        <Container>
          {newGrid.map((value, index) => {
            const isActive = value !== null;
            return (
              <Square key={index} onClick={() => humanMove(index)}>
                {isActive && <Marker>{value === player_x ? "x" : "o"}</Marker>}
              </Square>
            );
          })}
        </Container>
      );
    case game_status.over:
      return (
        <div>
          <p>{winner}</p>
          <Button onClick={newGame}>Start game</Button>
        </div>
      );
  }
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 315px;
  flex-flow: wrap;
  position: relative;
`;
const Square = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px solid green;
`;
const Marker = styled.p`
  font-size: 68px;
`;
const Row = styled.div`
  display: flex;
  width: 150px;
  justify-content: space-between;
`;

const Paragraph = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  align-items: center;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
`;
