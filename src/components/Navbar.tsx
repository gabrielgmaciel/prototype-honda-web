export function Navbar() {
  return (
    <header className="navbar">
      {/* ESQUERDA */}
      <div className="nav-left">
        <a href="#home">Início</a>
      </div>

      {/* CENTRO (LOGO) */}
      <div className="nav-center">
        <img
          src="/icons/honda-logo.svg"
          alt="Honda"
          className="logo"
        />
      </div>

      {/* DIREITA */}
      <div className="nav-right">
        <a href="#login">Login</a>
      </div>
    </header>
  )
}