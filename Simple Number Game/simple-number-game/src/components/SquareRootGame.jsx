import React, { useState, useEffect } from 'react';
import styles from './SquareRootGame.module.css';
import astroLogo from '../assets/astro.svg';

export default function SquareRootGuessingGame() {
  const [target, setTarget] = useState(16);
  const [accuracy, setAccuracy] = useState(10);
  const [guess, setGuess] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  const generateRandomTarget = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setTarget(newTarget);
    resetGame();
  };

  const resetGame = () => {
    setGuess('');
    setGameWon(false);
    setGuessCount(0);
    setFeedbackHistory([]);
    setCorrectAnswer(Math.sqrt(target));
  };

  const submit = () => {
    if (gameWon) return;

    const numGuess = Number(guess);
    const expectedSqrt = Math.sqrt(target);
    const upperBound = expectedSqrt * (1 + accuracy / 100);
    const lowerBound = expectedSqrt * (1 - accuracy / 100);

    setGuessCount(prev => prev + 1);

    let feedback;
    if (numGuess > upperBound) {
      feedback = `Your guess is too high. Aim lower.`;
    } else if (numGuess < lowerBound) {
      feedback = `Your guess is too low. Aim higher.`;
    } else {
      setGameWon(true);
      feedback = `Correct! You found the square root of ${target}.`;
    }

    setFeedbackHistory(prev => [feedback, ...prev]);
  };

  useEffect(() => {
    setCorrectAnswer(Math.sqrt(target));
  }, [target]);

  return (
    <>
      <div className={styles.background}></div>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img src={astroLogo.src} width="115" height="48" alt="Astro Homepage" />
        </div>
        
        <h1 className={styles.title}>Square root guessing game!</h1>
        
        <div className={styles.gameContent}>
          <div className={styles.inputRow}>
            Guess the square root of 
            <input 
              type="number" 
              min="1"
              className={styles.input}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
            within an accuracy of 
            <input 
              type="number" 
              min="1" 
              max="100"
              className={styles.input}
              value={accuracy}
              onChange={(e) => setAccuracy(Number(e.target.value))}
            />%.
          </div>
          
          <div className={styles.buttonContainer}>
            <button 
              onClick={generateRandomTarget}
              className={styles.randomButton}
            >
              Pick random number
            </button>
          </div>

          <div className={styles.inputRow}>
            Enter your guess: 
            <input 
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && submit()}
              className={styles.input}
            />
          </div>
          
          {gameWon && (
            <div className={styles.winMessage}>
              You win in {guessCount} guesses! Correct answer was {correctAnswer.toFixed(2)}.
            </div>
          )}

          <div className={styles.buttonContainer}>
            <button 
              onClick={resetGame}
              className={styles.resetButton}
            >
              Reset Game
            </button>
          </div>

          <div>
            {feedbackHistory.map((message, index) => (
              <div 
                key={index} 
                className={`
                  ${styles.feedbackItem}
                  ${message.includes('low') ? styles.feedbackLow : ''}
                  ${message.includes('high') ? styles.feedbackHigh : ''}
                  ${message.includes('Correct') ? styles.feedbackCorrect : ''}
                `}
              >
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}