import React, { useState } from "react";
import styles from "../styles/Decryption.module.css"; // Assuming you have styles in place

// Decrypt function for numeric values
const decrypt = (cipherText, d, n) => {
  return BigInt(cipherText) ** BigInt(d) % BigInt(n);
};

// Function to decrypt a single encrypted character
const decryptCharacter = (encryptedChar, d, n) => {
  const decryptedAscii = decrypt(encryptedChar, d, n); // RSA decryption
  return String.fromCharCode(Number(decryptedAscii)); // Convert decrypted ASCII to character
};

const Decryption = ({ privateKey }) => {
  const [cipherText, setCipherText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [steps, setSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false); // State to toggle the visibility of steps

  const handleDecrypt = (e) => {
    e.preventDefault();

    if (!cipherText || !privateKey) {
      alert("Please provide valid input and ensure private key is available.");
      return;
    }

    const { d, n } = privateKey;

    // Split ciphertext (hex values) into an array
    const encryptedChars = cipherText.trim().split(" ");
    const decryptedChars = [];
    const newSteps = [];

    for (const encryptedHex of encryptedChars) {
      const encryptedValue = BigInt(`0x${encryptedHex}`); // Convert hex to BigInt
      newSteps.push(
        `Decrypting character: ${encryptedHex} (Hexadecimal: ${encryptedValue})`
      );

      const decryptedChar = decryptCharacter(encryptedValue, d, n); // Decrypt the character
      decryptedChars.push(decryptedChar);
      newSteps.push(
        `Decrypted Hex: ${encryptedHex} to ASCII: ${decryptedChar.charCodeAt(
          0
        )} ('${decryptedChar}')`
      );
    }

    setSteps(newSteps);
    setDecryptedText(decryptedChars.join("")); // Join decrypted characters into a string
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Decryption</h2>
      <form onSubmit={handleDecrypt} className={styles.form}>
        <div>
          <label className={styles.label}>Cipher Text (Hexadecimal): </label>
          <input
            type="text"
            placeholder="Enter space-separated hex values"
            value={cipherText}
            onChange={(e) => setCipherText(e.target.value)}
            className={styles.input} // Applied input style here
          />
        </div>
        <button type="submit" className={styles.button}>Decrypt</button>
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

      {decryptedText && (
        <div className={styles.resultContainer}>
          <h3>Decrypted Text:</h3>
          <p>{decryptedText}</p>
        </div>
      )}
    </div>
  );
};

export default Decryption;
