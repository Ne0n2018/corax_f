'use client'

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<boolean>;
    userName: string;
}

export function BlockUserModal({ isOpen, onClose, onConfirm, userName }: Props) {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return;

        setIsSubmitting(true);
        await onConfirm(reason);
        setIsSubmitting(false);
        setReason("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#2C2C31] border border-[#50505E] rounded-3xl p-6 w-full max-w-md text-white relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold mb-2">Блокировка пользователя</h3>
                <p className="text-sm text-gray-300 mb-4">
                    Укажите причину блокировки для <span className="text-red-400 font-semibold">{userName}</span>
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Введите причину..."
                        required
                        className="bg-[#1C1C1E] border border-[#50505E] rounded-2xl p-4 text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 min-h-25 resize-none"
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-[#46464E] hover:bg-[#5a5a65] text-white rounded-[12px] px-5 py-2 cursor-pointer"
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !reason.trim()}
                            className="bg-[#D83C2D] hover:bg-[#b83325] text-white rounded-[12px] px-5 py-2 disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? "Блокировка..." : "Заблокировать"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}