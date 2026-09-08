import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Получаем оригинальную конфигурацию запроса
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            // ПРОВЕРКА: Если это запрос на проверку сессии, просто возвращаем ошибку
            // Укажи здесь точный путь к твоему эндпоинту me (например, '/auth/me' или '/users/me')
            if (originalRequest.url?.includes('/users/profile')) {
                return Promise.reject(error);
            }

            // Для остальных эндпоинтов (если пользователь был авторизован, но сессия истекла)
            if (typeof window !== 'undefined') {
                // Опционально: вместо жесткого редиректа лучше вызывать функцию logout из стора
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
)