import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";

const grid = new Array(3 ** 2).fill(null);
const player_x = 1;
const player_0 = 2;
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
  return gameStatus === game_status.choose_player ? (
    <Paragraph>
      <p>Choose player</p>
      <Row>
        <button onClick={() => selectPlayer(player_x)}>X</button>
        <button onClick={() => selectPlayer(player_0)}>0</button>
      </Row>
    </Paragraph>
  ) : (
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
