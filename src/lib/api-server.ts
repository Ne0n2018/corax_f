// src/lib/api-server.ts
import axios from 'axios';

export async function createServerApi() {

    return axios.create({
        baseURL: 'https://localhost/api',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}