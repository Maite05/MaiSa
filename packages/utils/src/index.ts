import type { PaginatedResult, PaginationMeta, PaginationQuery } from "@maisa/types";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export function getPagination(query: PaginationQuery): { skip: number; take: number; page: number; limit: number } {
  const page = query.page && query.page > 0 ? Math.floor(query.page) : 1;
  const limit = query.limit && query.limit > 0 ? Math.min(Math.floor(query.limit), MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE;

  return { skip: (page - 1) * limit, take: limit, page, limit };
}

export function paginatedResult<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T> {
  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };

  return { data: items, meta };
}

const DIACRITIC_PATTERN = /[̀-ͯ]/g;

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(DIACRITIC_PATTERN, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, "CONFLICT");
  }
}
