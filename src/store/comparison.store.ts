import {create} from "zustand";
import {persist} from "zustand/middleware";
import {api} from "@/lib/api";
import {toast} from "sonner";
import {ComparisonCheckResponse, ComparisonItem, MAX_COMPARISON_ITEMS} from "@/types/comparison";

// В localStorage сохраняем только порядок товаров — сами данные всегда приходят с сервера
type PersistedComparisonState = Pick<ComparisonStoreProps, "comparisonProductIds">;

interface ComparisonStoreProps {
    isLoading: boolean;
    error: string | null;
    // Порядок id = порядок колонок на странице сравнения
    comparisonProductIds: string[];
    comparisonItems: ComparisonItem[];

    getComparison: () => Promise<void>;
    addToComparison: (productId: string) => Promise<void>;
    removeFromComparison: (productId: string) => Promise<void>;
    toggleComparison: (productId: string) => Promise<void>;
    clearComparison: () => Promise<void>;
    checkIsInComparison: (productId: string) => Promise<boolean>;
    reorderComparison: (activeId: string, overId: string) => void;
}

// Перестановка элементов массива при drag&drop
const arrayMove = <T,>(list: T[], from: number, to: number): T[] => {
    const result = [...list];
    const [moved] = result.splice(from, 1);
    result.splice(to, 0, moved);
    return result;
};

// Применяем сохранённый порядок к ответу сервера: известные id — по порядку, остальные — как пришли
const applySavedOrder = (items: ComparisonItem[], order: string[]): ComparisonItem[] => {
    if (!order.length) return items;

    const byId = new Map(items.map((item) => [item.productId, item]));
    const ordered: ComparisonItem[] = [];

    order.forEach((id) => {
        const item = byId.get(id);
        if (item) {
            ordered.push(item);
            byId.delete(id);
        }
    });

    return [...ordered, ...byId.values()];
};

export const useComparisonStore = create<ComparisonStoreProps>()(
    persist<ComparisonStoreProps, [], [], PersistedComparisonState>(
        (set, get) => ({
            isLoading: false,
            error: null,
            comparisonProductIds: [],
            comparisonItems: [],

            getComparison: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get<ComparisonItem[]>('/comparison');
                    const rawData = response.data;
                    const items = (Array.isArray(rawData) ? rawData : []).filter((item) => item && item.product);

                    const orderedItems = applySavedOrder(items, get().comparisonProductIds);

                    set({
                        isLoading: false,
                        error: null,
                        comparisonItems: orderedItems,
                        comparisonProductIds: orderedItems.map((item) => item.productId),
                    });
                } catch (error: any) {
                    // Ошибка игнорируется (например, если пользователь не авторизован)
                    set({
                        isLoading: false,
                        error: error.response?.data?.message || "Ошибка при получении сравнения",
                        comparisonItems: [],
                        comparisonProductIds: [],
                    });
                }
            },

            addToComparison: async (productId: string) => {
                const { comparisonProductIds } = get();

                if (comparisonProductIds.includes(productId)) return;

                if (comparisonProductIds.length >= MAX_COMPARISON_ITEMS) {
                    toast.error(`В сравнении может быть не более ${MAX_COMPARISON_ITEMS} товаров`);
                    return;
                }

                try {
                    await api.post('/comparison', { productId });
                    set((state) => ({
                        comparisonProductIds: [...state.comparisonProductIds, productId],
                    }));
                    toast.success("Товар добавлен в сравнение");
                    // Подтягиваем данные товара, чтобы карточка сравнения была полной
                    await get().getComparison();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Ошибка при добавлении в сравнение");
                }
            },

            removeFromComparison: async (productId: string) => {
                try {
                    await api.delete(`/comparison/${productId}`);
                    set((state) => ({
                        comparisonProductIds: state.comparisonProductIds.filter((id) => id !== productId),
                        comparisonItems: state.comparisonItems.filter((item) => item.productId !== productId),
                    }));
                    toast.success("Товар удален из сравнения");
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Ошибка при удалении из сравнения");
                }
            },

            toggleComparison: async (productId: string) => {
                const isCompared = get().comparisonProductIds.includes(productId);
                if (isCompared) {
                    await get().removeFromComparison(productId);
                } else {
                    await get().addToComparison(productId);
                }
            },

            clearComparison: async () => {
                try {
                    await api.delete('/comparison');
                    set({ comparisonProductIds: [], comparisonItems: [] });
                    toast.success("Сравнение очищено");
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Ошибка при очистке сравнения");
                }
            },

            checkIsInComparison: async (productId: string) => {
                try {
                    const response = await api.get<ComparisonCheckResponse | boolean>(
                        `/comparison/check/${productId}`,
                    );
                    const data = response.data;

                    if (typeof data === "boolean") return data;
                    if (data && typeof data === "object") {
                        return Boolean(data.isInComparison ?? data.isCompared ?? data.result);
                    }
                    return false;
                } catch {
                    return false;
                }
            },

            reorderComparison: (activeId: string, overId: string) => {
                if (activeId === overId) return;

                set((state) => {
                    const from = state.comparisonProductIds.indexOf(activeId);
                    const to = state.comparisonProductIds.indexOf(overId);
                    if (from === -1 || to === -1) return state;

                    const itemFrom = state.comparisonItems.findIndex((item) => item.productId === activeId);
                    const itemTo = state.comparisonItems.findIndex((item) => item.productId === overId);

                    return {
                        comparisonProductIds: arrayMove(state.comparisonProductIds, from, to),
                        comparisonItems:
                            itemFrom !== -1 && itemTo !== -1
                                ? arrayMove(state.comparisonItems, itemFrom, itemTo)
                                : state.comparisonItems,
                    };
                });
            },
        }),
        {
            name: "comparison-storage",
            version: 1,
            partialize: (state) => ({ comparisonProductIds: state.comparisonProductIds }),
        },
    ),
);
