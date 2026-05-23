import { useState } from "react";
import api from "../api/api";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e: any) {
        e.preventDefault();

        try {
            const res = await api.post("/api/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.token);

            alert("Login OK!");
        } catch (err) {
            alert("Erro no login");
        }
    }

    return (
        <form onSubmit={handleLogin} style={styles.form}>
            <h2>Login</h2>

            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Senha"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Entrar</button>
        </form>
    );
}

const styles: any = {
    form: {
        display: "flex",
        flexDirection: "column",
        width: 300,
        margin: "100px auto",
        gap: 10
    }
};