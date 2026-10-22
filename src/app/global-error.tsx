"use client";

import {useEffect} from "react";

// Глобальная страница ошибки: рендерится вместо root layout,
// поэтому стили заданы inline.
export default function GlobalError({
                                        error,
                                        reset,
                                    }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="ru">
        <body
            style={{
                margin: 0,
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#121316",
                color: "#ffffff",
                fontFamily: "Montserrat, Arial, sans-serif",
                padding: "24px",
                boxSizing: "border-box",
            }}
        >
        <div
            style={{
                width: "100%",
                maxWidth: "640px",
                textAlign: "center",
                background: "#2C2C31",
                border: "1px solid #46464E",
                borderRadius: "20px",
                padding: "48px 24px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
            }}
        >
            <p style={{margin: 0, fontSize: "64px", lineHeight: 1, fontWeight: 700, color: "#ffffff"}}>
                500
            </p>
            <h1 style={{margin: "20px 0 0", fontSize: "24px"}}>Что-то пошло не так</h1>
            <p style={{margin: "12px 0 0", fontSize: "15px", lineHeight: 1.5, color: "rgba(255,255,255,0.7)"}}>
                На сервере произошла непредвиденная ошибка. Попробуйте обновить страницу.
            </p>
            <button
                type="button"
                onClick={reset}
                style={{
                    marginTop: "28px",
                    padding: "12px 24px",
                    borderRadius: "13px",
                    border: "none",
                    background: "#ffffff",
                    color: "#000000",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                }}
            >
                Попробовать снова
            </button>
        </div>
        </body>
        </html>
    );
}
