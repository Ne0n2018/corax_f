export enum PromoType {
    PERCENT = 'PERCENT',
    FIXED = 'FIXED',
}

export interface Promo {
    id: string
    code: string
    description: string
    type: PromoType
    isActive: boolean
    value: number
    validFrom: string
    validUntil: string
    maxUses: number
    minOrderAmount: number
    maxDiscount: number
    applicableSubcategories?: string[]
}

export interface PromoCreate {
    code: string
    description: string
    type: PromoType
    value: number
    validFrom: string
    validUntil: string
    maxUses: number
    minOrderAmount: number
    maxDiscount: number
    applicableSubcategories: string[] | null
}

export interface PromoUpdate {
    code?: string
    description?: string
    type?: PromoType
    value?: number
    validFrom?: string
    validUntil?: string
    maxUses?: number
    minOrderAmount?: number
    maxDiscount?: number
    applicableSubcategories?: string[]
}