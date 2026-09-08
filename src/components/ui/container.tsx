// src/components/ui/container.tsx
import * as React from "react";
import {cn} from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
    return (
        <div
            // w-full: занимает всю доступную ширину
            // max-w-7xl: ограничивает ширину (по умолчанию 1280px)
            // mx-auto: центрирует контейнер
            // px-4 sm:px-6 lg:px-8: адаптивные отступы по бокам (16px, 24px, 32px)
            className={cn("w-full max-w-7xl mx-auto ", className)}
            {...props}
        >
            {children}
        </div>
    );
}