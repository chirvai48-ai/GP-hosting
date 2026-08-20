import { describe, it, expect } from "vitest";
import {
  parsePagination,
  paginated,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "../src/utils/pagination";

describe("parsePagination", () => {
  it("defaults to page 1 + DEFAULT_LIMIT when no params", () => {
    expect(parsePagination({})).toEqual({
      page: 1,
      limit: DEFAULT_LIMIT,
      skip: 0,
      take: DEFAULT_LIMIT,
    });
  });

  it("parses explicit page + limit", () => {
    expect(parsePagination({ page: "3", limit: "10" })).toEqual({
      page: 3,
      limit: 10,
      skip: 20,
      take: 10,
    });
  });

  it("falls back on garbage params", () => {
    expect(parsePagination({ page: "abc", limit: "-5" }).page).toBe(1);
    expect(parsePagination({ page: "abc", limit: "-5" }).limit).toBe(DEFAULT_LIMIT);
  });

  it("clamps limit to MAX_LIMIT", () => {
    expect(parsePagination({ limit: "99999" }).limit).toBe(MAX_LIMIT);
  });

  it("treats page 0 as page 1", () => {
    expect(parsePagination({ page: "0" }).page).toBe(1);
    expect(parsePagination({ page: "0" }).skip).toBe(0);
  });
});

describe("paginated", () => {
  it("computes totalPages, hasNext, hasPrev", () => {
    const result = paginated([1, 2, 3], 10, 1, 5);
    expect(result).toEqual({
      items: [1, 2, 3],
      total: 10,
      page: 1,
      limit: 5,
      totalPages: 2,
      hasNext: true,
      hasPrev: false,
    });
  });

  it("hasNext false on last page", () => {
    expect(paginated([], 10, 2, 5).hasNext).toBe(false);
    expect(paginated([], 10, 2, 5).hasPrev).toBe(true);
  });
});