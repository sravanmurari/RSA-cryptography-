import React, { useState } from "react";
import styles from "../styles/KeyGeneration.module.css"; // Assuming you have styles in place

// Function to calculate the greatest common divisor (gcd)
const gcd = (a, b) => {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

// Function to check if a number is prime
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Function to calculate modular inverse (private key calculation)
const modInverse = (e, phi) => {
  let t = 0;
  let newT = 1;
  let r = phi;
  let newR = e;
  while (newR !== 0) {
    let quotient = Math.floor(r / newR);
    [t, newT] = [newT, t - quotient * newT];
    [r, newR] = [newR, r - quotient * newR];
  }
  if (r > 1) return null; // No modular inverse exists
  if (t < 0) t += phi;
  return t;
};

const KeyGeneration = ({ setKeys }) => {
  const [prime1, setPrime1] = useState("");
  const [prime2, setPrime2] = useState("");
  const [isKeysGenerated, setIsKeysGenerated] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  const generateKeys = (e) => {
    e.preventDefault();
    const p = parseInt(prime1);
    const q = parseInt(prime2);

    // Validate inputs
    if (!p || !q || !isPrime(p) || !isPrime(q) || p === q || p <= 10 || q <= 10) {
      alert("Please enter two distinct prime numbers greater than 10.");
      return;
    }

    const n = p * q;
    const phi = (p - 1) * (q - 1);

    // Start with a commonly used public exponent
    let eValue = 65537;
    if (gcd(eValue, phi) !== 1) {
      eValue = 3; // Fallback to 3 if 65537 is not valid
      while (gcd(eValue, phi) !== 1) {
        eValue++;
      }
    }

    const d = modInverse(eValue, phi);
    if (d === null || eValue === d) {
      alert("Failed to generate valid keys. Please try different primes.");
      return;
    }

    setKeys({
      publicKey: { e: eValue, n },
      privateKey: { d, n },
    });

    setPublicKey({ e: eValue, n });
    setPrivateKey({ d, n });
    setIsKeysGenerated(true);
  };

  const startExplanation = () => {
    setIsExplanationVisible(true);
    const stepsList = [
      `Entered Prime Numbers: p = ${prime1}, q = ${prime2}`,
      `Calculate n = p × q: n = ${publicKey?.n}`,
      `Calculate φ(n) = (p-1) × (q-1): φ(n) = ${(prime1 - 1) * (prime2 - 1)}`,
      `Select Public Exponent e: e = ${publicKey?.e}. (<b>This value is chosen because it is a small prime number that is commonly used in RSA to optimize encryption speed and ensure it is 
      <a href="https://en.wikipedia.org/wiki/Coprime" target="_blank" rel="noopener noreferrer">co-prime</a> with φ(n).</b>)`,
      `Calculate Private Key d: d = ${privateKey?.d}. (<b>The private key is calculated as the modular inverse of e modulo φ(n), which means it satisfies the equation (e × d) % φ(n) = 1. This ensures it is the unique counterpart to the public key for decryption.</b>)`,
    ];

    // Display steps one by one with a delay
    let currentStepIndex = 0;
    const interval = setInterval(() => {
      setSteps((prevSteps) => [...prevSteps, stepsList[currentStepIndex]]);
      currentStepIndex += 1;
      if (currentStepIndex >= stepsList.length) {
        clearInterval(interval);
      }
    }, 1000); // 2 seconds delay between each step
  };

  const resetKeys = () => {
    setPrime1("");
    setPrime2("");
    setIsKeysGenerated(false);
    setPublicKey(null);
    setPrivateKey(null);
    setSteps([]);
    setIsExplanationVisible(false); // Reset explanation visibility
  };

  return (
    <div className={styles.container}>
      <h2>RSA Key Generation</h2>
      <form onSubmit={generateKeys}>
        <div>
          <label>Prime 1:</label>
          <input
            type="number"
            value={prime1}
            onChange={(e) => setPrime1(e.target.value)}
            disabled={isKeysGenerated}
          />
        </div>
        <div>
          <label>Prime 2:</label>
          <input
            type="number"
            value={prime2}
            onChange={(e) => setPrime2(e.target.value)}
            disabled={isKeysGenerated}
          />
        </div>
        {!isKeysGenerated && <button type="submit">Generate Keys</button>}
      </form>

      {isKeysGenerated && (
        <div>
          <h3>Keys Generated!</h3>
          <p>Public Key: e = {publicKey.e}, n = {publicKey.n}</p>
          <p>Private Key: d = {privateKey.d}, n = {publicKey.n}</p>
          <div>
            <h4>Steps:</h4>
            {isExplanationVisible && (
              <>
                {steps.map((step, index) => (
                  <p
                    key={index}
                    dangerouslySetInnerHTML={{ __html: step }} // Render HTML links properly
                  ></p>
                ))}
              </>
            )}
            {!isExplanationVisible && (
              <button onClick={startExplanation}>Explanation</button>
            )}
          </div>
          <button onClick={resetKeys}>Generate New Keys</button>
        </div>
      )}
    </div>
  );
};

export default KeyGeneration;
