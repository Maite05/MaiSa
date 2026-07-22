import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { JwtPayload, OrgRole } from "@maisa/types";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(payload: JwtPayload, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyAccessToken(token: string, secret: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}

export const ROLE_RANK: Record<OrgRole, number> = {
  MEMBER: 1,
  PLANNER: 2,
  ADMIN: 3,
  OWNER: 4,
};

export function hasMinimumRole(role: OrgRole, minimum: OrgRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export type { JwtPayload, OrgRole };
