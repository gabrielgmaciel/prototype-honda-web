import { useEffect, useState } from "react";
import styles from "./Users.module.css";

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type User = {
  id: string;
  imageProfile: string;
  email: string;
  name: string;
  phone: string;
  address: Address;
  roles: string[];
};

type SearchType = "name" | "email";

export function Users() {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchType, setSearchType] =
    useState<SearchType>("name");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [confirmAction, setConfirmAction] =
    useState<() => void>(() => {});

  const size = 10;

  const token = localStorage.getItem("token");

  /* =========================
     LOAD USERS
  ========================== */
  async function loadUsers(pageNumber = 0) {

    try {

      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/api/users/all?page=${pageNumber}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNumber);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  }

  /* =========================
     SEARCH
  ========================== */
  async function handleSearch() {

    try {

      setLoading(true);

      if (!search.trim()) {
        return loadUsers(0);
      }

      const url =
        searchType === "email"
          ? `http://localhost:8080/api/users/search?email=${search}&name=&page=0&size=${size}`
          : `http://localhost:8080/api/users/search?email=&name=${search}&page=0&size=${size}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setPage(0);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  }

  /* =========================
     UPDATE ACCESS
  ========================== */
  async function updateAccess(
    id: string,
    newAccess: string
  ) {

    try {

      await fetch(
        `http://localhost:8080/api/users/update/access?userCode=${id}&newAccess=${newAccess}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      loadUsers(page);

    } catch (err) {

      console.error(err);
    }
  }

  /* =========================
     DELETE USER
  ========================== */
  async function deleteUser(id: string) {

    try {

      await fetch(
        `http://localhost:8080/api/users/close/account?userCode=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      loadUsers(page);

    } catch (err) {

      console.error(err);
    }
  }

  useEffect(() => {

    loadUsers(0);

  }, []);

  function getPages() {

    const pages = [];

    const max = Math.min(totalPages, 5);

    for (let i = 0; i < max; i++) {
      pages.push(i);
    }

    return pages;
  }

  return (
    <div className={styles.container}>

      <h1 className={styles.title}>
        Usuários
      </h1>

      {/* SEARCH */}
      <div className={styles.searchCard}>

        <select
          value={searchType}
          onChange={(e) =>
            setSearchType(
              e.target.value as SearchType
            )
          }
        >
          <option value="name">
            Nome
          </option>

          <option value="email">
            Email
          </option>

        </select>

        <input
          placeholder={`Buscar por ${searchType}`}
          value={search}
          onChange={(e) => {

            const value = e.target.value;

            setSearch(value);

            if (!value.trim()) {
              loadUsers(0);
            }
          }}
          onKeyDown={(e) => {

            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button
          className={styles.searchButton}
          onClick={handleSearch}
        >
          Buscar
        </button>

      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>

        <table className={styles.table}>

          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Roles</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {users.map((user, i) => {

              const isAdmin =
                user.roles.includes("admin");

              return (
                <tr key={i}>

                  <td>
                    <img
                      src={
                        user.imageProfile ||
                        "/icons/profile-icon.jpg"
                      }
                      className={styles.avatar}
                    />
                  </td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>

                    <div className={styles.rolesContainer}>

                      {user.roles.map((r, i) => (
                        <span
                          key={i}
                          className={styles.role}
                        >
                          {r}
                        </span>
                      ))}

                      <button
                        className={styles.accessButton}
                        title={
                          isAdmin
                            ? "Alterar para usuário comum"
                            : "Alterar para admin"
                        }
                        onClick={() => {

                          setModalText(
                            isAdmin
                              ? "Deseja realmente remover os acessos de admin desse usuário?"
                              : "Deseja realmente tranformar esse usuário em admin?"
                          );

                          setConfirmAction(() => () =>
                            updateAccess(
                              user.id,
                              isAdmin
                                ? "user"
                                : "admin"
                            )
                          );

                          setModalOpen(true);
                        }}
                      >
                        ⇄
                      </button>

                    </div>

                  </td>

                  <td>

                    <button
                      className={styles.deleteButton}
                      title="Excluir usuário"
                      onClick={() => {

                        setModalText(
                          "Deseja excluir este usuário?"
                        );

                        setConfirmAction(() => () =>
                          deleteUser(user.id)
                        );

                        setModalOpen(true);
                      }}
                    >
                      <img
                        src="/icons/lixeira-de-reciclagem.png"
                        alt="Excluir"
                        className={styles.deleteIcon}
                      />
                    </button>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>

        <button
          onClick={() => loadUsers(page - 1)}
          disabled={page === 0}
        >
          {"<"}
        </button>

        {getPages().map((p) => (
          <button
            key={p}
            onClick={() => loadUsers(p)}
            className={
              p === page
                ? styles.activePage
                : ""
            }
          >
            {p + 1}
          </button>
        ))}

        <button
          onClick={() => loadUsers(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          {">"}
        </button>

      </div>

      {/* MODAL */}
      {modalOpen && (

        <div className={styles.modalOverlay}>

          <div className={styles.modal}>

            <h3>
              Confirmar ação
            </h3>

            <p>
              {modalText}
            </p>

            <div className={styles.modalButtons}>

              <button
                className={styles.cancelButton}
                onClick={() =>
                  setModalOpen(false)
                }
              >
                Cancelar
              </button>

              <button
                className={styles.confirmButton}
                onClick={() => {

                  confirmAction();

                  setModalOpen(false);
                }}
              >
                Confirmar
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}