import React, { useRef, useState } from "react";
import "../styles/SmartInputs.css";

export default function SmartInputs({ onSubmit }) {
  const [values, setValues] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, e) => {
    const newValues = [...values];
    newValues[index] = e.target.value;
    setValues(newValues);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < 3) {
        inputRefs[index + 1].current?.focus();
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    const allFilled = values.every((v) => v.trim() !== "");

    if (!allFilled) {
      setValues(["", "", "", ""]);
      inputRefs[0].current?.focus();
      return;
    }

    onSubmit({
      n1: values[0],
      n2: values[1],
      n3: values[2],
      num: values[3],
    });

    setValues(["", "", "", ""]);
    inputRefs[0].current?.focus();
  };

  return (
    <div className="smart-inputs">
      {values.map((val, i) => (
        <input
          key={i}
          ref={inputRefs[i]}
          value={val}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          placeholder={["n1", "n2", "n3", "Target"][i]}
          className="smart-input"
        />
      ))}
    </div>
  );
}
