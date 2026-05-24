import type { User } from "../types/user";

export async function getUserData(): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:8080/api/users/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return response.json();
}