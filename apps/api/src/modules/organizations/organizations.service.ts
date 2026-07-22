import { prisma } from "@maisa/database";
import type { OrgRole } from "@maisa/types";
import { ConflictError, ForbiddenError, NotFoundError } from "@maisa/utils";
import { slugify } from "@maisa/utils";

import type { AddMemberInput, CreateOrganizationInput, UpdateOrganizationInput } from "./organizations.schemas";

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

export async function listMyOrganizations(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { organization: true },
  });

  return memberships.map((m) => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    role: m.role,
  }));
}

export async function getOrganizationById(userId: string, organizationId: string) {
  const membership = await prisma.membership.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
    include: { organization: true },
  });

  if (!membership) {
    throw new NotFoundError("Organization not found");
  }

  return { ...membership.organization, role: membership.role };
}

export async function createOrganization(userId: string, input: CreateOrganizationInput) {
  const slug = await uniqueOrgSlug(input.name);

  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({ data: { name: input.name, slug } });
    await tx.membership.create({ data: { organizationId: organization.id, userId, role: "OWNER" } });
    return organization;
  });
}

export async function updateOrganization(organizationId: string, input: UpdateOrganizationInput) {
  return prisma.organization.update({ where: { id: organizationId }, data: { name: input.name } });
}

export async function listMembers(organizationId: string) {
  const memberships = await prisma.membership.findMany({
    where: { organizationId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  return memberships.map((m) => ({ ...m.user, role: m.role, membershipId: m.id }));
}

export async function addMember(organizationId: string, input: AddMemberInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new NotFoundError("No user account exists with that email yet");
  }

  const existing = await prisma.membership.findUnique({
    where: { organizationId_userId: { organizationId, userId: user.id } },
  });
  if (existing) {
    throw new ConflictError("This user is already a member of the organization");
  }

  return prisma.membership.create({
    data: { organizationId, userId: user.id, role: input.role },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

async function assertNotLastOwner(organizationId: string, userId: string, action: string) {
  const membership = await prisma.membership.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
  });
  if (!membership) {
    throw new NotFoundError("Membership not found");
  }

  if (membership.role === "OWNER") {
    const ownerCount = await prisma.membership.count({ where: { organizationId, role: "OWNER" } });
    if (ownerCount <= 1) {
      throw new ForbiddenError(`Cannot ${action} the last owner of the organization`);
    }
  }

  return membership;
}

export async function updateMemberRole(organizationId: string, userId: string, role: OrgRole) {
  if (role !== "OWNER") {
    await assertNotLastOwner(organizationId, userId, "demote");
  }

  return prisma.membership.update({
    where: { organizationId_userId: { organizationId, userId } },
    data: { role },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

export async function removeMember(organizationId: string, userId: string) {
  await assertNotLastOwner(organizationId, userId, "remove");

  await prisma.membership.delete({ where: { organizationId_userId: { organizationId, userId } } });
}
