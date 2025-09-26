import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: 0 };

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(s => s + 1);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood]);

  const handleKeyPress = useCallback((e) => {
    if (gameOver) return;
    
    if (!gameStarted) setGameStarted(true);
    
    switch (e.key.toLowerCase()) {
      case 'w':
        setDirection({ x: 0, y: -1 });
        break;
      case 's':
        setDirection({ x: 0, y: 1 });
        break;
      case 'a':
        setDirection({ x: -1, y: 0 });
        break;
      case 'd':
        setDirection({ x: 1, y: 0 });
        break;
    }
  }, [gameOver, gameStarted]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 200);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  const handleTouch = (dir) => {
    if (gameOver) return;
    if (!gameStarted) setGameStarted(true);
    setDirection(dir);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <img src="/assets/nerdearla-logo-ar.png" alt="Nerdear.la" className="h-16 mx-auto mb-4" />
        <div className="mb-4">
          <span className="text-2xl font-bold">
            <span className="text-green-500">C</span>
            <span className="text-yellow-500">r</span>
            <span className="text-red-500">e</span>
            <span className="text-green-500">a</span>
            <span className="text-yellow-500">d</span>
            <span className="text-red-500">o</span>
            <span className="text-green-500"> </span>
            <span className="text-yellow-500">p</span>
            <span className="text-red-500">o</span>
            <span className="text-green-500">r</span>
            <span className="text-yellow-500"> </span>
            <span className="text-red-500">N</span>
            <span className="text-green-500">i</span>
            <span className="text-yellow-500">c</span>
            <span className="text-red-500">o</span>
            <span className="text-green-500">l</span>
            <span className="text-yellow-500">a</span>
            <span className="text-red-500">s</span>
            <span className="text-green-500"> </span>
            <span className="text-yellow-500">A</span>
            <span className="text-red-500">y</span>
            <span className="text-green-500">a</span>
            <span className="text-yellow-500">l</span>
            <span className="text-red-500">a</span>
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Snake Game</h1>
        <p className="text-xl text-green-400">Puntuación: {score}</p>
      </div>

      <div className="relative bg-gray-800 border-2 border-gray-600 mb-4" 
           style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}>
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute w-5 h-5 ${index === 0 ? 'bg-green-400' : 'bg-green-600'}`}
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}
        <div
          className="absolute w-5 h-5 bg-red-500 rounded-full"
          style={{
            left: food.x * 20,
            top: food.y * 20,
          }}
        />
      </div>

      {gameOver && (
        <div className="text-center mb-4">
          <p className="text-2xl text-red-500 mb-2">¡Juego Terminado!</p>
          <button
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Jugar de Nuevo
          </button>
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-gray-400 mb-2">Usa WASD o los botones táctiles</p>
      </div>

      <div className="grid grid-cols-3 gap-2 w-48">
        <div></div>
        <button
          onTouchStart={() => handleTouch({ x: 0, y: -1 })}
          onClick={() => handleTouch({ x: 0, y: -1 })}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-xl font-bold"
        >
          ↑
        </button>
        <div></div>
        <button
          onTouchStart={() => handleTouch({ x: -1, y: 0 })}
          onClick={() => handleTouch({ x: -1, y: 0 })}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-xl font-bold"
        >
          ←
        </button>
        <button
          onTouchStart={() => handleTouch({ x: 0, y: 1 })}
          onClick={() => handleTouch({ x: 0, y: 1 })}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-xl font-bold"
        >
          ↓
        </button>
        <button
          onTouchStart={() => handleTouch({ x: 1, y: 0 })}
          onClick={() => handleTouch({ x: 1, y: 0 })}
          className="bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg text-xl font-bold"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default App;