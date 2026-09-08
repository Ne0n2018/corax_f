import {useEffect, useState} from "react";
import Image from "next/image";
import {X} from "lucide-react";

export function ImagePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Очищаем память при размонтировании или смене файла
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    if (!previewUrl) return null;

    return (
        <div className="relative w-fit">
        <Image
            src={previewUrl}
            alt="Превью"
            className="object-cover rounded-[14px]"
            width={216}
            height={271}
    />
    <button
    type="button"
    onClick={onRemove}
    className="absolute top-2 right-1 bg-[#46464E] hover:bg-red-600 text-white p-3.5 rounded-[15px] shadow-md transition-colors"
    >
    <X className="w-4 h-4" />
        </button>
        </div>
);
}