import styles from "./Login.module.css";

export function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Login</h1>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Senha" />

        <button>Entrar</button>
      </div>
    </div>
  );
}