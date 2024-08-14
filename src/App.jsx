import { useState } from 'react'
import './App.css'

// Import sound files
import greenSound from './assets/sounds/green.mp3'
import redSound from './assets/sounds/red.mp3'
import yellowSound from './assets/sounds/yellow.mp3'
import blueSound from './assets/sounds/blue.mp3'
import wrongSound from './assets/sounds/wrong.mp3'

function App() {
  const [gamePattern, setGamePattern] = useState([])
  const [level, setLevel] = useState(0)
  const [isBtnDisable, setBtnDisable] = useState(false)
  const [isGameOver, setGameOver] = useState(false);
  const [userClickedPattern, setUserClickedPattern] = useState([])

  const btnColors = [
    {
      id: 1,
      name: 'Green',
      class: 'green',
      key: '1',
      sound: greenSound
    },
    {
      id: 2,
      name: 'Red',
      class: 'red',
      key: '2',
      sound: redSound
    },
    {
      id: 3,
      name: 'Yellow',
      class: 'yellow',
      key: '3',
      sound: yellowSound
    },
    {
      id: 4,
      name: 'Blue',
      class: 'blue',
      key: '4',
      sound: blueSound
    },
  ]

  const nextSequence = () => {
    const num = Math.floor(Math.random() * 4) + 1
    setLevel((prevLevel) => prevLevel + 1);
    handleGamePattern(num)
    setUserClickedPattern([]);
  }

  const handleGamePattern = (num) => {
    setGamePattern(prevPattern => {
      const newPattern = [...prevPattern, num];
      animateSequence(newPattern);
      return newPattern;
    });
  }

  const animateSequence = (pattern) => {
    setBtnDisable(true) // Disable buttons
    pattern.forEach((num, index) => {
      setTimeout(() => {
        const btn = btnColors[num - 1]
        animateButton(btn.class);
        playSound(btn.sound)

        if (index === pattern.length - 1) {
          setTimeout(() => {
            setBtnDisable(false) // Re-enable buttons after animation
          }, 500)
        }
      }, 500 * index);
    });
  }

  const animateButton = (btnClass) => {
    const button = document.querySelector(`.${btnClass}`);
    button.classList.add('pressed');
    setTimeout(() => {
      button.classList.remove('pressed');
    }, 200);
  }

  const userChosenColor = (colorId) => {
    setUserClickedPattern([...userClickedPattern, colorId])
    const btn = btnColors[colorId - 1]
    animateButton(btn.class);
    playSound(btn.sound)
    checkAnswer(colorId, userClickedPattern.length)
  }

  const checkAnswer = (colorId , index) => {
    if(gamePattern[index] === colorId) {
      if(level-1 === index) {
        setBtnDisable(true)
        setTimeout(() => {nextSequence(); setBtnDisable(false)}, 1000)
      }
    } else {
      const body = document.body
      body.classList.add('game-over')
      playSound(wrongSound)

      setTimeout(() => {
        body.classList.remove('game-over');
        setGameOver(true);
      }, 200);
    }
  }

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  }

  const startOver = () => {
    setGameOver(false)
    setLevel(0)
    setGamePattern([])
  }

  return (
    <>
    <div className='header-container'>
    <h1 className='level-title'>
          { 
            gamePattern.length === 0 && !isGameOver 
              ? 'Do what simon says...' 
              : !isGameOver 
                ? `Level ${level}` 
                : 'Game Over'
          }
        </h1>
        { (gamePattern.length === 0 && !isGameOver) && <p className='subtitle'>Follow the pattern of lights and sounds for as long as you can...</p> }
    </div>

        {
          (!isGameOver && gamePattern.length > 0) &&
          (
            <div className="container">
              {
                btnColors.map((btn) => 
                  <button key={btn.id} 
                          disabled={isBtnDisable || level < 1}
                          className={`btn ${btn.class}`}
                          onClick={() => userChosenColor(btn.id)}></button>
                )
              }
            </div>
          )
        }
        {isGameOver && (
          <button className='pixel' onClick={startOver}>
            Start Over
          </button>
        )}
        {gamePattern.length === 0 && (
          <button className='pixel' onClick={nextSequence}>
            Start Game
          </button>
        )}
    </>
  )
}

export default App
