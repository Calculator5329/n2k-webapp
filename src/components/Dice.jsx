import React, { useState } from 'react';
import '../Dice.css';

const diceFaces = {
    1: [false, false, false, false, true, false, false, false, false],
    2: [true, false, false, false, false, false, false, false, true],
    3: [true, false, false, false, true, false, false, false, true],
    4: [true, false, true, false, false, false, true, false, true],
    5: [true, false, true, false, true, false, true, false, true],
    6: [true, false, true, true, false, true, true, false, true],
    7: [true, false, true, true, true, true, true, false, true],
    8: [true, true, true, true, false, true, true, true, true],
    9: [true, true, true, true, true, true, true, true, true]
};

const Dice = ({ diceNumbers, setDiceNumbers }) => {
    const [rolling, setRolling] = useState(false);

    const rollDice = () => {
        if (rolling) return;

        setRolling(true);
        setTimeout(() => {
            setDiceNumbers([
                Math.floor(Math.random() * 9) + 1,
                Math.floor(Math.random() * 9) + 1,
                Math.floor(Math.random() * 9) + 1
            ]);
            setRolling(false);
        }, 1000);
    };

    return (
        <div className="dice-container">
            <div className="dice-wrapper">
                {diceNumbers.map((num, index) => (
                    <div key={index} className={`dice ${rolling ? 'rolling' : ''}`}>
                        {diceFaces[num].map((dot, dotIndex) => (
                            <div key={dotIndex} className={`dot ${dot ? 'visible' : ''}`} />
                        ))}
                    </div>
                ))}
            </div>
            <button className="roll-button" onClick={rollDice} disabled={rolling}>
                Roll Dice
            </button>
        </div>
    );
};

export default Dice;
