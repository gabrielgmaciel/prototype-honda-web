export async function loginRequest(email: string, password: string) {
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const token = await response.text(); // 👈 AQUI É TEXT, NÃO JSON

  if (!response.ok) {
    throw new Error("Erro ao fazer login");
  }

  return token;
}