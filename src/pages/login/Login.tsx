import { useState } from "react";
import styles from "./Login.module.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    let hasError = false;

    // EMAIL
    if (!validateEmail(email)) {
      setEmailError("Digite um email válido");
      hasError = true;
    } else {
      setEmailError("");
    }

    // SENHA
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    alert("Login realizado com sucesso!");
  }

  return (
    <div className={styles.container}>
      {/* ESQUERDA */}
      <div className={styles.left}>
        <div className={styles.card}>
          <h1>Bem-vindo</h1>
          <p>Faça login para continuar</p>

          <form onSubmit={handleLogin} className={styles.form}>
            
            {/* EMAIL */}
            <input
              type="text"   // 👈 evita mensagem em inglês do browser
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />

            {emailError && (
              <span className={styles.error}>{emailError}</span>
            )}

            {/* SENHA */}
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />

            {passwordError && (
              <span className={styles.error}>{passwordError}</span>
            )}

            {/* BOTÕES */}
            <button type="submit" className={styles.loginBtn}>
              Entrar
            </button>

            <button type="button" className={styles.registerBtn}>
              Criar conta
            </button>

          </form>
        </div>
      </div>

      {/* DIREITA */}
      <div className={styles.right}>
        <div className={styles.overlay} />
        <div className={styles.brand}>
          <h2>Honda Experience</h2>
          <p>Performance. Tecnologia. Futuro.</p>
        </div>
      </div>
    </div>
  );
}