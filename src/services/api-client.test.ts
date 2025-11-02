import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiGet } from "./api-client";

describe("apiGet", () => {
  const realFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("returns JSON when response is ok", async () => {
    const mockResponse = { hello: "world" };
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => mockResponse,
    })) as unknown as typeof fetch;

    globalThis.fetch = fetchMock;

    const result = await apiGet<{ hello: string }>("/test");
    expect(result).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://fe-task-api.mainstack.io/test",
      {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: undefined,
      }
    );
  });

  it("throws ApiError with message from JSON body when response is not ok", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({ message: "Invalid query" }),
    })) as unknown as typeof fetch;

    globalThis.fetch = fetchMock;

    await expect(apiGet("/bad")).rejects.toMatchObject(
      new ApiError("Invalid query", 400)
    );
  });

  it("throws ApiError with statusText when response body is not valid JSON", async () => {
    const consoleErrorMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => {
        throw new Error("invalid json");
      },
    })) as unknown as typeof fetch;

    globalThis.fetch = fetchMock;

    await expect(apiGet("/broken")).rejects.toMatchObject(
      new ApiError("Internal Server Error", 500)
    );

    expect(consoleErrorMock).toHaveBeenCalled();
    consoleErrorMock.mockRestore();
  });
});
