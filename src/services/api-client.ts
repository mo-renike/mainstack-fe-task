const API_BASE_URL = "https://fe-task-api.mainstack.io";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiGetOptions = {
  signal?: AbortSignal;
};

export async function apiGet<T>(
  path: string,
  options: ApiGetOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal: options.signal,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody.message === "string") {
        message = errorBody.message;
      }
    } catch (err) {
      console.error(err);
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}
