import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../services/auth";
import { isAdmin } from "../../utils/auth";
import styles from "./Login.module.css";

export function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    let hasError = false;

    // EMAIL VALIDATION
    if (!validateEmail(email)) {
      setEmailError("Digite um email válido");
      hasError = true;
    } else {
      setEmailError("");
    }

    // PASSWORD VALIDATION
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      setLoading(true);

      // 🔥 chama API (retorna JWT string)
      const token = await loginRequest(email, password);

      // salva token
      localStorage.setItem("token", token);

      // 🔥 redirecionamento por role
      if (isAdmin(token)) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err: any) {
      setError(err.message || "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
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
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />

            {emailError && (
              <span className={styles.error}>{emailError}</span>
            )}

            {/* PASSWORD */}
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

            {/* ERROR API */}
            {error && (
              <span className={styles.error}>{error}</span>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {/* REGISTER BUTTON */}
            <button
              type="button"
              className={styles.registerBtn}
              onClick={() => navigate("/register")}
            >
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