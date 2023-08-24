import { useState, useEffect } from 'react';
import QrReader from 'react-qr-reader';
import { getPlayerProgress, submitCode, onClueAdvanced, onGameStarted, onGameOver } from './path_to_ethersUtil';

const clues = [ /* Your list of clues based on the clue number */ ];

export default function Game() {
  const [code, setCode] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [currentClue, setCurrentClue] = useState('');

  useEffect(() => {
    async function fetchPlayerProgress() {
      const progress = await getPlayerProgress(/* player's address */);
      setCurrentClue(clues[progress - 1]);
    }

    fetchPlayerProgress();

    onGameStarted((event) => {
      // Update the UI based on the GameStarted event
      // For example, you might want to display a message or update the UI in some other way
    });

    onClueAdvanced((event) => {
      setCurrentClue(clues[event.newLevel - 1]);
    });

    onGameOver((event) => {
      // Update the UI based on the GameOver event
      // For example, you might want to display a congratulatory message or redirect the user
    });

    return () => {
      gameContract.removeAllListeners('GameStarted');
      gameContract.removeAllListeners('ClueAdvanced');
      gameContract.removeAllListeners('GameOver');
    };
  }, []);

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleSubmit = async () => {
    await submitCode(code, /* currentTokenId */);
  };

  return (
    <div>
      <h1>Current Clue</h1>
      <p>{currentClue}</p>

      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>Scanned Code: {scanResult}</p>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your 8-digit code"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
