import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
};

export function getUserFromToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (err) {
    return null;
  }
}

export function isAdmin(token: string): boolean {
  const user = getUserFromToken(token);
  return user?.roles?.includes("admin") ?? false;
}