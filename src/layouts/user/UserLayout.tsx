// src/layouts/UserLayout/UserLayout.tsx

import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "./UserLayout.module.css";

export function UserLayout() {

  const navigate = useNavigate();

  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {

    async function loadUser() {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8080/api/users/data",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUserName(data.name);

      } catch (error) {
        console.error(error);
      }
    }

    loadUser();

  }, []);

  function handleLogout() {

    localStorage.removeItem("token");

    navigate("/login");
  }

  return (
    <div className={styles.container}>

      {/* SIDEBAR */}
      <aside className={styles.sidebar}>

        <div className={styles.userSection}>

          <h2>
            Olá, {userName}
          </h2>

          <span>
            Minha conta
          </span>

        </div>

        <nav className={styles.nav}>

          <button
            onClick={() => navigate("/user/profile")}
          >
            Dados pessoais
          </button>

          <button
            onClick={() => navigate("/user/deals")}
          >
            Negociações
          </button>

        </nav>

      </aside>

      {/* MAIN */}
      <div className={styles.main}>

        {/* TOPBAR */}
        <header className={styles.topbar}>

          <div></div>

          <img
            src="/icons/honda-logo.svg"
            alt="Honda"
            className={styles.logo}
          />

          <button
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Sair
          </button>

        </header>

        {/* CONTENT */}
        <main className={styles.content}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}