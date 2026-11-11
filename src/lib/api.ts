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
    async (error) => {
        // Получаем оригинальную конфигурацию запроса
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            // ПРОВЕРКА: Если это запрос на проверку сессии, просто возвращаем ошибку
            if (originalRequest.url?.includes('/users/profile')) {
                return Promise.reject(error);
            }

            // Для остальных эндпоинтов: сбрасываем сессию локально и показываем
            // тост с кнопкой «Войти» — вместо жёсткого редиректа, который терял
            // бы пользователя с произвольной страницы.
            // Динамические импорты разрывают цикл api ↔ сторы.
            if (typeof window !== 'undefined') {
                const [{useUserStore}, {toast}, {openAuthDialog}] = await Promise.all([
                    import("@/store/user.store"),
                    import("sonner"),
                    import("@/lib/require-auth"),
                ]);
                useUserStore.getState().logout();

                toast.error("Сессия истекла, войдите заново", {
                    description: "Ваша сессия истекла. Войдите, чтобы продолжить",
                    action: {label: "Войти", onClick: () => openAuthDialog("Login")},
                    duration: 10_000,
                });
            }
        }

        return Promise.reject(error);
    }
)