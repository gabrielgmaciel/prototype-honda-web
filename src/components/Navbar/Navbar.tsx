import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import styles from "./Navbar.module.css";

type Car = {
  id: string;
  name: string;
};

type UserData = {
  name: string;
  email: string;
  image?: string;
};

export function Navbar() {

  const [open, setOpen] = useState(false);
  const [vehiclesOpen, setVehiclesOpen] = useState(false);

  const [cars, setCars] = useState<Car[]>([]);

  const [authenticated, setAuthenticated] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    name: "Usuário",
    email: ""
  });

  const [isAdmin, setIsAdmin] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  /* =========================
     JWT
  ========================== */
  function parseJwt(token: string) {

    try {

      const base64Url = token.split(".")[1];

      const base64 = base64Url
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      return JSON.parse(window.atob(base64));

    } catch {
      return null;
    }
  }

  function validateToken() {

    const token = localStorage.getItem("token");

    if (!token) {
      setAuthenticated(false);
      setIsAdmin(false);
      return;
    }

    const decoded = parseJwt(token);

    if (!decoded) {
      setAuthenticated(false);
      setIsAdmin(false);
      return;
    }

    const now = Date.now() / 1000;

    if (decoded.exp < now) {

      localStorage.removeItem("token");

      setAuthenticated(false);
      setIsAdmin(false);

      return;
    }

    setAuthenticated(true);

    const roles = decoded.roles || [];

    setIsAdmin(
      roles.includes("admin")
    );
  }

  /* =========================
     USER
  ========================== */
  async function loadUser() {

    try {

      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        "http://localhost:8080/api/users/data",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      setUserData({
        name: data.name,
        email: data.email,
        image: data.imageProfile
      });

    } catch (error) {
      console.error(error);
    }
  }

  /* =========================
     CARS
  ========================== */
  async function loadCars() {

    try {

      const res = await fetch(
        "http://localhost:8080/api/cars/all"
      );

      if (!res.ok) return;

      const data = await res.json();

      setCars(data);

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {

    validateToken();
    loadCars();
    loadUser();

  }, []);

  /* =========================
     CLOSE MODAL
  ========================== */
  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  /* =========================
     NAVIGATE
  ========================== */
  function handleNavigate(id: string) {

    setOpen(false);

    navigate(`/vehicle/view/${id}`);
  }

  /* =========================
     LOGOUT
  ========================== */
  function handleLogout() {

    localStorage.removeItem("token");

    setAuthenticated(false);
    setProfileOpen(false);
    setOpen(false);
    setIsAdmin(false);

    window.location.href = "/";
  }

  return (
    <>
      <nav className={styles.navbar}>

        {/* LEFT */}
        <div className={styles.left}>
          <button
            className={styles.menuButton}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* CENTER */}
        <div className={styles.center}>
          <Link
            to="/"
            onClick={() => setOpen(false)}
          >
            <img
              src="/icons/honda-logo.svg"
              className={styles.logo}
              alt="Logo"
            />
          </Link>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>

          {!authenticated ? (

            <Link
              to="/login"
              className={styles.login}
            >
              Login
            </Link>

          ) : (

            <div
              className={styles.profileWrapper}
              ref={profileRef}
            >

              <button
                className={styles.profileButton}
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
              >
                <img
                  src={
                    userData.image ||
                    "/icons/profile-icon.jpg"
                  }
                  className={styles.profileImage}
                  alt="Perfil"
                />
              </button>

              <div
                className={`${styles.profileDropdown} ${profileOpen
                  ? styles.profileDropdownOpen
                  : ""
                  }`}
              >

                {/* TOP */}
                <div className={styles.profileTop}>

                  <img
                    src={
                      userData.image ||
                      "/icons/profile-icon.jpg"
                    }
                    className={styles.profileLargeImage}
                    alt="Perfil"
                  />

                  <div className={styles.profileInfo}>
                    <h3>
                      {userData.name}
                    </h3>

                    <span>
                      {userData.email}
                    </span>
                  </div>

                </div>

                {/* DIVIDER */}
                <div className={styles.profileDivider} />

                {/* ACTIONS */}
                <div className={styles.profileActions}>

                  <button
                    className={styles.accountButton}
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <span className={styles.gear}>⚙</span>
                    Conta
                  </button>

                  <div className={styles.verticalDivider} />

                  {isAdmin ? (
                    <button
                      className={styles.adminButton}
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/admin");
                      }}
                    >
                      Admin
                    </button>
                  ) : (
                    <button
                      className={styles.logoutButtonUser}
                      onClick={handleLogout}
                    >
                      Sair
                    </button>
                  )}

                </div>

                {isAdmin && (
                  <>
                    <div className={styles.profileDivider} />

                    <button
                      className={styles.logoutButton}
                      onClick={handleLogout}
                    >
                      Sair
                    </button>
                  </>
                )}

              </div>

            </div>

          )}

        </div>

      </nav>

      {/* OVERLAY */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""
          }`}
        onClick={() => setOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""
          }`}
      >

        <div className={styles.sidebarHeader}>
          Honda
        </div>

        <Link
          to="/"
          className={styles.sidebarLink}
          onClick={() => setOpen(false)}
        >
          Home
        </Link>

        <div
          className={styles.vehiclesToggle}
          onClick={() =>
            setVehiclesOpen(!vehiclesOpen)
          }
        >
          <span>
            Veículos{" "}
            <span className={styles.chevron}>
              {vehiclesOpen ? "▾" : "▸"}
            </span>
          </span>
        </div>

        <div
          className={`${styles.carList} ${vehiclesOpen
            ? styles.carListOpen
            : ""
            }`}
        >

          {cars.map((car) => (
            <div
              key={car.id}
              className={styles.carItem}
              onClick={() =>
                handleNavigate(car.id)
              }
            >
              {car.name}
            </div>
          ))}

        </div>

      </aside>
    </>
  );
}