import React, { useState } from "react";
import styles from "../styles/Encryption.module.css"; // Assuming you have styles in place

// Encrypt function for numeric values
const encrypt = (plainText, e, n) => {
  return BigInt(plainText) ** BigInt(e) % BigInt(n);
};

// Encrypt individual character
const encryptCharacter = (char, e, n) => {
  const charCode = char.charCodeAt(0); // Get numeric value of character
  return encrypt(charCode, e, n); // Use your existing RSA encrypt function
};

const Encryption = ({ publicKey }) => {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState([]);
  const [steps, setSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false); // State to toggle the visibility of steps

  const handleEncrypt = (e) => {
    e.preventDefault();

    if (!plainText || !publicKey) {
      alert("Please provide valid input and ensure public key is available.");
      return;
    }

    const { e: publicExponent, n } = publicKey;

    const encryptedChars = [];
    const newSteps = [];

    for (const char of plainText) {
      const charCode = char.charCodeAt(0); // Convert character to ASCII
      const hexCharCode = charCode.toString(16); // Convert ASCII to hexadecimal
      newSteps.push(
        `Encrypting character: '${char}' (ASCII: ${charCode}, Hex: ${hexCharCode})`
      );

      const encryptedChar = encryptCharacter(char, publicExponent, n); // Encrypt the ASCII value
      const hexEncryptedChar = encryptedChar.toString(16); // Convert encrypted value to hexadecimal
      encryptedChars.push(hexEncryptedChar); // Store encrypted value in hexadecimal

      newSteps.push(
        `Encrypted '${char}' (Hex: ${hexCharCode}) to: ${hexEncryptedChar}`
      );
    }

    setSteps(newSteps);
    setCipherText(encryptedChars);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Encryption</h2>
      <form onSubmit={handleEncrypt} className={styles.form}>
        <div>
          <label className={styles.label}>Plain Text: </label>
          <input
            type="text"
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            className={styles.input} // Added input style here
          />
        </div>
        <button type="submit" className={styles.button}>Encrypt</button>
      </form>

      <div>
        <button 
          className={styles.toggleButton}
          onClick={() => setShowSteps(!showSteps)} // Toggle the visibility of steps
        >
          {showSteps ? "Hide Steps" : "Show Steps"}
        </button>
      </div>

      {showSteps && (
        <div className={styles.stepsContainer}>
          <h3>Steps:</h3>
          {steps.map((step, index) => (
            <p key={index} className={styles.step}>{step}</p>
          ))}
        </div>
      )}

      {cipherText.length > 0 && (
        <div className={styles.resultContainer}>
          <h3>Encrypted Text (Hexadecimal):</h3>
          <p>{cipherText.join(" ")} (Hex representation)</p>
        </div>
      )}
    </div>
  );
};

export default Encryption;
