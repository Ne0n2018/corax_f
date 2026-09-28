export interface Product {
    id: string;
    name: string;
    imageUrl: string;
}

export interface UserFavorite {
    product:Product[];
}

export interface FavoriteItem {
    id: string;      // ID записи в таблице избранного
    product: Product; // Вложенный объект товара
}

export interface FavoriteItemResponse {
    productId: string;
}