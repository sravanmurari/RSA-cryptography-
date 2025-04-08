import React from "react";
import KeyGeneration from "./components/KeyGeneration";
import Encryption from "./components/Encryption";
import Decryption from "./components/Decryption";
import styles from "./styles/App.module.css";

const App = () => {
  const [keys, setKeys] = React.useState(null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>RSA Visualization</h1>
      </header>
      <div className={styles.card}>
        <KeyGeneration setKeys={setKeys} />
      </div>
      {keys && (
        <>
          <div className={styles.card}>
            <Encryption publicKey={keys.publicKey} />
          </div>
          <div className={styles.card}>
            <Decryption privateKey={keys.privateKey} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
