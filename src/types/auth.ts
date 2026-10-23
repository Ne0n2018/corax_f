// Провайдеры OAuth-входа, поддерживаемые бэкендом
export type OAuthProvider = 'google' | 'yandex';

export interface OAuthConnectResponse {
    url: string;
}
