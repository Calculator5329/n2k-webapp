import { React } from "react";
import "../styles/HowToPage.css";

function HowToPage() {
  return (
    <div className="howto-container">
      <section className="how-to-play">
        <h1>How to Play</h1>

        <h3>🎲 Board Slam</h3>
        <p>In Board Slam, you're given:</p>
        <ul>
          <li>A board of numbers (e.g., 1–36 or counting by 2s, 3s, etc)</li>
          <li>Three dice showing numbers from 1–19</li>
        </ul>
        <p>
          <strong>Your goal:</strong> Create equations using the dice to match
          values on the board.
        </p>
        <p>
          <strong>How it works:</strong>
        </p>
        <ul>
          <li>
            You may use the dice in any order, and you can raise them to any
            exponent.
          </li>
          <li>
            Use the operations: <code>+</code>, <code>-</code>, <code>×</code>,
            or <code>÷</code> to create an equation
          </li>
          <li>The result must match a number on the board</li>
          <li>
            You can only use each of the dice once per problem (no repeats)
          </li>
          <li>You must use all 3 of the dice</li>
          <li>You must follow the correct order of operations (PEMDAS)</li>
        </ul>
        <p>
          <strong>Example (Dice: 2, 3, 5)</strong>
        </p>
        <pre>2 * 3 - 5 = 1</pre>
        <pre>2^2 + 3 + 5 → 4 + 3 + 5 = 12</pre>

        <p>
          <strong>Playing the game</strong>
        </p>
        <ul>
          <li>
            Each round is <strong>timed (1 minute)</strong>
          </li>
          <li>Score as many correct values as you can</li>
        </ul>

        <p>
          <strong>Full rounds</strong>
        </p>

        <ul>
          <li>
            In full rounds, you'll play <strong>5 games in a row</strong> and
            track your average
          </li>
          <li>
            To ensure scoreboard accuracy, you must enter your equations in the
            full rounds
          </li>
          <li>
            This is accomplished through the <strong>input box</strong> on the
            right side of the screen
          </li>
          <li>
            In each box, enter your dice and exponent values in the format{" "}
            <code>base exponent</code> (e.g., <code>2^3</code> as{" "}
            <code>23</code> or <code>11^2</code> as <code>112</code>)
          </li>
          <li>
            You may enter just the base number if you do not want to raise it to
            a power (e.g., <code>2</code> is interpreted as <code>2^1</code>)
          </li>
          <li>
            You may not raise the number 1 to any power, so just enter{" "}
            <code>1</code> if you want the number 1
          </li>
          <li>
            The last box is for the answer to the equation (your operators will
            be inferred)
          </li>
        </ul>

        <div className="separator"></div>

        <h3>✍️ Written Problems</h3>
        <p>You’ll see a problem like:</p>
        <pre>x^2 + y^1 * z^3 = 65</pre>
        <p>
          <strong>Your goal:</strong> Enter values for x, y, and z that make the
          equation true.
        </p>
        <ul>
          <li>
            All values are between <strong>1–9</strong>
          </li>
          <li>
            There can be <strong>several correct solutions</strong>
          </li>
          <li>
            Each round has <strong>5 problems</strong>
          </li>
          <li>Your total time is recorded — go fast!</li>
        </ul>

        <div className="separator"></div>

        <h3>Site Navigation</h3>
        <ul>
          <li>
            <code>/practice</code> → Custom Board Slam for practice
          </li>
          <li>
            <code>/play-written</code> → Written Problems
          </li>
          <li>
            <code>/play?pattern=X</code> → Board Slam with board counting by X
            (e.g., 2, 3, 4, etc.)
          </li>
          <li>
            <code>/play-written?difficulty=medium</code> → Written Problems at
            Medium difficulty
          </li>
        </ul>
      </section>
    </div>
  );
}

export default HowToPage;
