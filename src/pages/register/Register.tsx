import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

export function Register() {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [zip, setZip] = useState("");
  const [address, setAddress] = useState<Address | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const navigate = useNavigate();

  /* =========================
     TELEFONE MASK
  ========================= */
  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    const d1 = digits.slice(0, 2);
    const d2 = digits.slice(2, 7);
    const d3 = digits.slice(7, 11);

    if (digits.length <= 2) return `(${d1}`;
    if (digits.length <= 7) return `(${d1}) ${d2}`;
    return `(${d1}) ${d2}-${d3}`;
  }

  /* =========================
     CEP SEARCH
  ========================= */
  async function searchCep(value: string) {
    try {
      setLoadingCep(true);

      const res = await fetch(
        `http://localhost:8080/api/addresses?zipCode=${value}`
      );

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("CEP response inválido:", text);
        return;
      }

      setAddress({
        street: data.address,
        city: data.city,
        state: data.state,
        zip: data.zipCode
      });

    } finally {
      setLoadingCep(false);
    }
  }

  function handleZip(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);
    setZip(cleaned);

    if (cleaned.length === 8) {
      searchCep(cleaned);
    }
  }

  /* =========================
     SUBMIT FLOW (FIXED)
  ========================= */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!address) return;

    if (password !== confirmPassword) {
      alert("Senhas não conferem");
      return;
    }

    try {
      setLoading(true);

      /* 1️⃣ REGISTER */
      const registerRes = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageProfile: "",
            email,
            name,
            password,
            phone,
            address: {
              street: address.street,
              city: address.city,
              state: address.state,
              zip: address.zip
            }
          })
        }
      );

      const registerText = await registerRes.text();

      if (!registerRes.ok) {
        console.error("Erro register:", registerText);
        throw new Error("Erro ao cadastrar usuário");
      }

      /* 2️⃣ LOGIN (RETORNA STRING JWT) */
      const loginRes = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const token = await loginRes.text(); // 🔥 CORREÇÃO PRINCIPAL

      if (!loginRes.ok || !token) {
        console.error("Erro login:", token);
        throw new Error("Falha no login");
      }

      localStorage.setItem("token", token);

      /* 3️⃣ UPLOAD IMAGEM (SE EXISTIR) */
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await fetch(
          "http://localhost:8080/api/users/upload/image/profile",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          }
        );

        if (!uploadRes.ok) {
          console.error("Erro upload imagem");
        }
      }

      alert("Cadastro realizado com sucesso!");
      window.dispatchEvent(new Event("auth_change"));
      navigate("/");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className={styles.page}>

      {/* LOADING CEP / GLOBAL */}
      {(loading || loadingCep) && (
        <div className={styles.overlay}>
          <div className={styles.dots}>
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>

        <h1 className={styles.title}>Cadastro</h1>

        {/* TOP */}
        <div className={styles.topSection}>

          <label className={styles.imageBox}>
            {imageFile ? (
              <img src={URL.createObjectURL(imageFile)} />
            ) : (
              <span>Imagem</span>
            )}

            <input
              type="file"
              hidden
              onChange={(e) =>
                setImageFile(e.target.files?.[0] || null)
              }
            />
          </label>

          <div className={styles.inputsCol}>
            <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input
              placeholder="Telefone"
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
            />
          </div>

        </div>

        {/* CEP */}
        <div className={styles.row}>
          <input
            placeholder="CEP"
            value={zip}
            onChange={e => handleZip(e.target.value)}
          />

          <div className={styles.cityState}>
            <input
              value={address ? `${address.city} - ${address.state}` : ""}
              placeholder="Cidade"
              disabled
            />
          </div>
        </div>

        {/* ENDEREÇO */}
        <input
          value={address?.street || ""}
          placeholder="Endereço"
          disabled
        />

        {/* SENHA */}
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        {/* BUTTON */}
        <div className={styles.buttonBox}>
          <button type="submit" disabled={loading}>
            Cadastrar
          </button>
        </div>

      </form>
    </div>
  );
}