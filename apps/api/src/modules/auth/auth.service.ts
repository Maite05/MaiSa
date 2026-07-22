import { hashPassword, signAccessToken, verifyPassword } from "@maisa/auth";
import { env } from "@maisa/config";
import { prisma } from "@maisa/database";
import { ConflictError, UnauthorizedError, slugify } from "@maisa/utils";

import type { LoginInput, SignupInput } from "./auth.schemas";

function issueToken(userId: string, email: string): string {
  return signAccessToken({ sub: userId, email }, env.JWT_SECRET, env.JWT_EXPIRES_IN);
}

async function uniqueOrgSlug(name: string): Promise<string> {
  const base = slugify(name) || "org";
  let slug = base;
  let attempt = 0;

  while (await prisma.organization.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    if (attempt > 10) break;
  }

  return slug;
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);
  const slug = await uniqueOrgSlug(input.organizationName);

  const { user, organization } = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { name: input.organizationName, slug },
    });

    const user = await tx.user.create({
      data: { name: input.name, email: input.email, passwordHash },
    });

    await tx.membership.create({
      data: { organizationId: organization.id, userId: user.id, role: "OWNER" },
    });

    return { user, organization };
  });

  const token = issueToken(user.id, user.email);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
    organization: { id: organization.id, name: organization.name, slug: organization.slug },
  };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user?.passwordHash || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = issueToken(user.id, user.email);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { memberships: { include: { organization: true } } },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    organizations: user.memberships.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      role: m.role,
    })),
  };
}
