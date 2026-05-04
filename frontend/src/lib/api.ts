import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//add token to request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//intercept 404s
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const username = localStorage.getItem('username')
    const refresh_token = localStorage.getItem("refresh_token")
    if (!username || !refresh_token) {
    window.location.href = "/";
    return Promise.reject(error);
    }
    
    const originalRequest = error.config;
    
    //essayer de rafraichir d'abord non? si ca fait des délais faudra tej ca
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //demander un nouveau JWT avec le refresh token si on en trouve dans le backend
        const refreshToken = localStorage.getItem("refresh_token");
        const username = localStorage.getItem('username');

        const response = await axios.post(`${BACKEND_URL}/auth/refresh/acess_token`, {
          username: username,
          refresh_token: refreshToken,
        });
        
        const newAccessToken = response.data.access_token; //pas totalement sur qu'il renvoie sous ce format
        localStorage.setItem("access_token", newAccessToken);

         //retry avec le nouveau
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");

        window.location.href = "/"; // Redirige vers l'accueil
        console.log("Erreur dans la rotation du acess_token: ",refreshError)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);