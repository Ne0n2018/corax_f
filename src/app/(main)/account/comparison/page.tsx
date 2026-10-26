import type {Metadata} from 'next'
import { ComparisonCatalog } from '@/components/shared/comparison/comparisonCatalog'

export const metadata: Metadata = {
    title: 'Сравнение товаров — Corax',
}

export default function AccountComparisonPage() {
    return <ComparisonCatalog />
}
