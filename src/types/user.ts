 export type Roles = 'REGULAR' | 'ADMIN' | 'GYM'

export interface User {
    id: string
    isActive: boolean
    displayName: string;
    email: string;
    birthday: string;
    number: string;
    address: string;
    role: Roles;
}


 export interface UserAdmin {
     id: string;
     displayName: string;
     email: string;
     number: string;
     role: Roles;
     isActive: boolean;
     createdAt: string;
     updatedAt: string;
 }

 export interface UserMeta {
     page: number;
     limit: number;
     total: number;
     totalPages: number;
 }

 export interface GetUsersParams {
     page?: number;
     limit?: number;
     search?: string;
     sortBy?: string;
 }