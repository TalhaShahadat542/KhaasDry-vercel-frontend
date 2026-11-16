import axios from "axios";

import { supabase } from "./supabaseClient";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://khaasdry-vercel-backend.vercel.app/api",
});

// Attach the current Supabase access token to every request going to Django.
apiClient.interceptors.request.use(async (config) => {
  const isPlaceholder =
    !import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.VITE_SUPABASE_URL.includes("your-project-ref") ||
    !supabase;

  let token = null;

  if (isPlaceholder) {
    const mockSession = localStorage.getItem("mock_session");
    if (mockSession) {
      try {
        token = JSON.parse(mockSession)?.access_token;
      } catch (e) {
        // ignore parse error
      }
    }
  } else if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      token = data?.session?.access_token;
    } catch (e) {
      // ignore
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
