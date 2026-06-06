import { SignJWT, jwtVerify } from "jose";
import bcryptjs from "bcryptjs";
import { findUserById, findUserWithPasswordByEmail } from "./auth.repository.js";
import { env } from "../../config/env.js";
import type { PublicUser } from "@opsflow/shared";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export async function login(
  email: string,
  password: string
): Promise<{ user: PublicUser; token: string } | null> {
  const dbUser = await findUserWithPasswordByEmail(email);
  if (!dbUser) return null;

  const valid = await bcryptjs.compare(password, dbUser.passwordHash);
  if (!valid) return null;

  const token = await new SignJWT({
    sub: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(JWT_SECRET);

  return {
    user: {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role as PublicUser["role"],
    },
    token,
  };
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET, {
    clockTolerance: 60,
  });
  return payload;
}

export async function getUserFromToken(token: string): Promise<PublicUser | null> {
  const payload = await verifyToken(token);
  if (!payload.sub) return null;
  return findUserById(payload.sub as string);
}
