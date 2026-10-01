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

// Публичный ответ GET /providers
export type PublicProvider = {
    id: string,
    name: string,
    imageUrl?: string | null,
    description?: string | null,
}
