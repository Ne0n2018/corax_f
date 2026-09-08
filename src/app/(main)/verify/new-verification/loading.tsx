// src/app/verify/new-verification/loading.tsx
export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#EC5B4D] rounded-full animate-spin mb-4" />
            <h2 className="text-lg font-russo text-black">Подтверждаем вашу почту...</h2>
            <p className="text-sm text-gray-500 mt-1">Пожалуйста, подождите, это займет пару секунд.</p>
        </div>
    );
}