// src/app/verify/new-verification/page.tsx
import {redirect} from "next/navigation";
import Link from "next/link";
import {createServerApi} from "@/lib/api-server";
import * as https from "node:https";
import {Container} from "@/components/ui/container";

interface PageProps {
    searchParams: Promise<{ vToken?: string }>;
}

export default async function NewVerificationPage({ searchParams }: PageProps) {
    const { vToken } = await searchParams;


    if (!vToken) {
        redirect("/?verify=false");
    }

    let errorMessage: string | null = null;

    try {
        const api = await createServerApi()
       await api.post('/auth/email-confirmation', {token: vToken}, {httpsAgent: new https.Agent({rejectUnauthorized: false})})

        // При успехе редиректим на главную и открываем окно логина с флагом подтверждения
        redirect("/?verify=true");
    } catch (error: any) {
        // redirect() в Next.js выбрасывает специальное исключение NEXT_REDIRECT,
        // его нельзя перехватывать как ошибку запроса
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }

        errorMessage = error.response?.data?.message || "Ссылка недействительна или просрочена";
    }

    return (
        <Container className="flex flex-col items-center justify-center min-h-screen bg-gray-50 ">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                <h1 className="text-xl font-russo text-red-500 mb-2">
                    Ошибка подтверждения
                </h1>
                <p className="text-gray-600 text-sm mb-6">
                    {errorMessage}
                </p>
                <Link
                    href="/"
                    className="inline-block bg-[#EC5B4D] text-white px-6 py-3 rounded-[13px] font-medium hover:bg-[#d94f42] transition-colors"
                >
                    Перейти к входу
                </Link>
            </div>
        </Container>
    );
}