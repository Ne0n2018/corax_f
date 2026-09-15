import {useEffect, useState} from "react";
import Image from "next/image";
import {X} from "lucide-react";

interface ImagePreviewProps {
    file: File | string | null;
    onRemove: () => void;
}

export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        // Если передан готовый URL (строка)
        if (typeof file === "string") {
            setPreviewUrl(file);
            return;
        }

        // Если передан файл
        if (file instanceof File) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            // Очищаем blob-ссылку из памяти
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file]);

    if (!previewUrl) return null;

    return (
        <div className="relative w-fit">
            <Image
                src={previewUrl}
                alt="Превью"
                className="object-cover rounded-[14px]"
                width={216}
                height={160}
                unoptimized
            />
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 bg-[#46464E]/80 hover:bg-red-600 text-white p-2.5 rounded-[12px] shadow-md transition-colors cursor-pointer"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}