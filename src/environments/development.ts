const { VITE_API_URL } = import.meta.env;

export const development = {
  production: false,
  api_url: VITE_API_URL,
};
