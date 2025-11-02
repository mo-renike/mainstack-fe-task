import React, { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import * as apiClient from "./api-client";
import { useTransactionsQuery, useUserQuery, useWalletQuery } from "./queries";

describe("queries hooks", () => {
  const realFetch = globalThis.fetch;
  let container: HTMLDivElement | null = null;
  const roots: Array<ReturnType<typeof createRoot>> = [];

  beforeEach(() => {
    vi.restoreAllMocks();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    for (const r of roots) {
      act(() => r.unmount());
    }
    roots.length = 0;
    if (container) {
      container.remove();
      container = null;
    }
    globalThis.fetch = realFetch;
  });

  function renderWithClient(ui: React.ReactElement) {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    let root: ReturnType<typeof createRoot>;
    act(() => {
      root = createRoot(container!);
      root.render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
      roots.push(root!);
    });
    return { root: root! };
  }

  it("useTransactionsQuery returns sorted transactions", async () => {
    const txs = [
      { id: "1", date: "2024-01-01", type: "deposit" },
      { id: "2", date: "2024-02-01", type: "withdrawal" },
      { id: "3", date: "2023-12-15", type: "deposit" },
    ];

    const apiSpy = vi.spyOn(apiClient, "apiGet").mockResolvedValue(txs);

    const promise = new Promise((resolve) => {
      function TestComp() {
        const { data, isSuccess } = useTransactionsQuery();
        useEffect(() => {
          if (isSuccess) resolve(data);
        }, [isSuccess, data]);
        return null;
      }

      renderWithClient(<TestComp />);
    });

    const data = (await promise) as Array<{ id: string }>;

    expect(apiSpy).toHaveBeenCalled();

    expect(data.map((d) => d.id)).toEqual(["2", "1", "3"]);
  });

  it("useUserQuery and useWalletQuery return their respective data", async () => {
    const user = { id: "u1", name: "Jane" };
    const wallet = { id: "w1", balance: 100 };

    const apiSpy = vi.spyOn(apiClient, "apiGet");
    apiSpy.mockImplementation(async (path: string) => {
      if (path === "/user") return user;
      if (path === "/wallet") return wallet;
      return null;
    });

    const userPromise = new Promise((resolve) => {
      function TestUser() {
        const { data, isSuccess } = useUserQuery();
        useEffect(() => {
          if (isSuccess) resolve(data);
        }, [isSuccess, data]);
        return null;
      }

      renderWithClient(<TestUser />);
    });

    const walletPromise = new Promise((resolve) => {
      function TestWallet() {
        const { data, isSuccess } = useWalletQuery();
        useEffect(() => {
          if (isSuccess) resolve(data);
        }, [isSuccess, data]);
        return null;
      }

      renderWithClient(<TestWallet />);
    });

    const receivedUser = await userPromise;
    const receivedWallet = await walletPromise;

    expect(receivedUser).toEqual(user);
    expect(receivedWallet).toEqual(wallet);
  });
});
