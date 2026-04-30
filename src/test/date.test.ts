import { describe, expect, it } from "vitest";

import { formatCalendarDateParts, parseDateOnly } from "@/lib/date";

describe("parseDateOnly", () => {
  it("preserves the calendar day for YYYY-MM-DD values", () => {
    const date = parseDateOnly("2026-05-01");

    expect(date).not.toBeNull();
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(4);
    expect(date?.getDate()).toBe(1);
  });

  it("rejects invalid date strings", () => {
    expect(parseDateOnly("2026-02-31")).toBeNull();
    expect(parseDateOnly("2026/05/01")).toBeNull();
  });
});

describe("formatCalendarDateParts", () => {
  it("returns stable parts for display", () => {
    expect(formatCalendarDateParts("2026-05-01", "en-US")).toMatchObject({
      day: 1,
    });
  });
});
