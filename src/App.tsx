import { useEffect, useState } from "react";
import "./App.css";

type Game = Array<
  Array<{
    is_mine: boolean;
    row_index: number;
    col_index: number;
    is_clicked: boolean;
  }>
>;

function App() {
  const [total_mine_count, setTotalMineCount] = useState(0);
  const getNeighborMineCount = (
    game: Game,
    row_index: number,
    col_index: number
  ) => {
    let neighbor_count = 0;
    for (
      let i = Math.max(row_index - 1, 0);
      i <= Math.min(row_index + 1, game.length - 1);
      i++
    ) {
      for (
        let j = Math.max(col_index - 1, 0);
        j <= Math.min(col_index + 1, game.length - 1);
        j++
      ) {
        if (i === row_index && j == col_index) {
          continue;
        }
        const node = game[i][j];
        if (node.is_mine) {
          neighbor_count++;
        }
      }
    }
    return neighbor_count;
  };

  const getGame = () => {
    const game = [];
    let total_mine = 0;

    for (let j = 0; j < 8; j++) {
      const col = [];
      for (let i = 0; i < 8; i++) {
        const is_mine = total_mine >= 10 ? false : Math.random() < 0.2;
        col.push({
          is_mine: is_mine ? true : false,
          row_index: j,
          col_index: i,
          is_clicked: false,
        });
        if (is_mine) {
          total_mine++;
        }
      }
      setTotalMineCount(total_mine);
      game.push(col);
    }

    return game;
  };

  const [game, setGame] = useState<Game>([]);

  useEffect(() => {
    setGame(getGame());
  }, []);

  return (
    <div className="flex game-container ">
      <div
        style={{
          backgroundColor: "rgb(196,196,196)",
        }}
        className="grid-cols-8 grid w-[400px] h-[400px] "
      >
        {game.map((row, index) => (
          <div key={index} className="grid grid-cols-1 ">
            {row.map((col, index) => (
              <div
                style={{
                  color: "black",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                }}
                key={index}
                onClick={() => {
                  if (col.is_mine) {
                    alert("You lose!!!");
                    const clone_game = game;

                    clone_game.flat().forEach((c) => (c.is_clicked = true));
                    setGame(() => [...clone_game]);
                    return;
                  }

                  const clone_game = game;
                  clone_game[col.row_index][col.col_index].is_clicked = true;
                  if (
                    total_mine_count >=
                    game.flat().length -
                      game.flat().filter((c) => c.is_clicked).length
                  ) {
                    alert("You win!!!");
                  }
                  setGame(() => [...clone_game]);
                }}
                className="box-shadow cell aspect-square flex items-center justify-center shadow-xl"
              >
                {col.is_clicked
                  ? col.is_mine
                    ? "*"
                    : getNeighborMineCount(game, col.row_index, col.col_index)
                  : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="button-wrapper">
        <button
          className="reset-button"
          onClick={() => {
            setGame(getGame());
          }}
        >
          🔁 Reset Game
        </button>
      </div>
    </div>
  );
}

export default App;
