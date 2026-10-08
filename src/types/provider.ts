export type Provider = {
    name: string,
    id: string,
}

export type Providers = {
    id: string,
    name: string,
    imageUrl: string,
    description: string,
}

// Товар бренда в публичном ответе GET /providers/{id}
export type BrandProduct = {
    id: string,
    name: string,
    imageUrl?: string | null,
    defaultPrice?: number | null,
    formRelease?: string | null,
    shortDescription?: string | null,
}

// Публичный ответ GET /providers
export type PublicProvider = {
    id: string,
    name: string,
    imageUrl?: string | null,
    description?: string | null,
    products?: BrandProduct[],
}
