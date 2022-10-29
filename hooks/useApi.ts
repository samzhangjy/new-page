export type HTTP_METHODS = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type API_PROPS = {
  method: HTTP_METHODS;
  body?: any;
  token?: string;
};

const useApi = (url: string, { method, token, body }: API_PROPS) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
};

export default useApi;
