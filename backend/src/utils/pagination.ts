export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

// Parses `?page=` and `?limit=` from a request query. Never throws: bad values
// fall back to defaults. `limit` is clamped to [1, MAX_LIMIT].
export function parsePagination(
  query: Record<string, unknown>
): PaginationParams {
  const rawPage = typeof query.page === "string" ? query.page : undefined;
  const rawLimit = typeof query.limit === "string" ? query.limit : undefined;

  const parsedPage = rawPage !== undefined ? Number.parseInt(rawPage, 10) : 1;
  const page = Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const parsedLimit =
    rawLimit !== undefined ? Number.parseInt(rawLimit, 10) : DEFAULT_LIMIT;
  const limit =
    Number.isInteger(parsedLimit) && parsedLimit >= 1
      ? Math.min(parsedLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): Paginated<T> {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function paginatedResponse<T>(
  message: string,
  items: T[],
  total: number,
  page: number,
  limit: number
) {
  return { message, data: paginated(items, total, page, limit) };
}