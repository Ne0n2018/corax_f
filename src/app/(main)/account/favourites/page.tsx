import type {Metadata} from 'next'
import { FavoriteCatalog } from '@/components/shared/favorite/favoriteCatalog'

export const metadata: Metadata = {
    title: 'Избранное — Corax',
}

export default function AccountFavouritesPage() {
    return (
        <FavoriteCatalog/>
    )
}
