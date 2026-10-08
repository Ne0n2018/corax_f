'use client'

import { useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Store } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useProviderStore } from '@/store/provider.store'
import { useProductStore } from '@/store/product.store'
import type { BrandProduct, PublicProvider } from '@/types/provider'

interface BrandDialogProps {
	brand: PublicProvider | null
	isOpen: boolean
	onClose: () => void
}

export function BrandDialog({ brand, isOpen, onClose }: BrandDialogProps) {
	const publicProvider = useProviderStore((s) => s.publicProvider)
	const isProviderLoading = useProviderStore((s) => s.isPublicProviderLoading)
	const getPublicProviderById = useProviderStore((s) => s.getPublicProviderById)

	const brandProducts = useProductStore((s) => s.brandProducts)
	const isProductsLoading = useProductStore((s) => s.isBrandProductsLoading)
	const getBrandProducts = useProductStore((s) => s.getBrandProducts)

	const brandId = brand?.id

	// Полная информация о бренде
	useEffect(() => {
		if (!isOpen || !brandId) return
		void getPublicProviderById(brandId)
	}, [isOpen, brandId, getPublicProviderById])

	// Товары бренда: сначала берём из ответа /providers/{id},
	// если бэкенд их не вернул — фильтруем публичный каталог по имени производителя
	const details = publicProvider?.id === brandId ? publicProvider : null
	const detailsProducts = details?.products

	useEffect(() => {
		if (!isOpen || !brand?.name) return
		if (Array.isArray(detailsProducts) && detailsProducts.length > 0) return
		void getBrandProducts(brand.name)
	}, [isOpen, brand?.name, detailsProducts, getBrandProducts])

	// Пока детали не пришли — показываем данные из карточки
	const info = useMemo(() => {
		return {
			name: details?.name || brand?.name || 'Бренд',
			imageUrl: details?.imageUrl || brand?.imageUrl || null,
			description: details?.description || brand?.description || null,
		}
	}, [details, brand])

	const products: BrandProduct[] = useMemo(() => {
		if (Array.isArray(detailsProducts) && detailsProducts.length > 0) {
			return detailsProducts
		}
		return brandProducts
	}, [detailsProducts, brandProducts])

	const isLoadingProducts = isProductsLoading && products.length === 0

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] w-full overflow-x-hidden overflow-y-auto rounded-[18px] bg-white p-6 font-sans sm:max-w-4xl sm:p-8">
				{/* Шапка диалога: декоративный фон-полоса во всю ширину */}
				<DialogHeader
					className="-mx-6 -mt-6 flex-row justify-center items-center rounded-t-[18px] px-6 py-5 sm:-mx-8 sm:-mt-8 sm:px-8"
					style={{
						backgroundImage: "url('/provider-bg.png')",
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
				>
					<DialogTitle className="flex  font-russo text-xl text-black">
						Бренд {info.name}
					</DialogTitle>
					<DialogDescription className="sr-only">
						Информация о бренде и его товары
					</DialogDescription>
				</DialogHeader>

				{/* Шапка бренда: слева текст с описанием, справа изображение */}
				<div className="flex flex-col-reverse gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:gap-8">
					<div className="min-w-0 flex-1">
						{isProviderLoading && !info.description ? (
							<div className="mt-3 space-y-2">
								<Skeleton className="h-4 w-full bg-gray-200" />
								<Skeleton className="h-4 w-3/4 bg-gray-200" />
							</div>
						) : (
							info.description && (
								<p className="mt-3 text-sm leading-relaxed text-gray-600">
									{info.description}
								</p>
							)
						)}
					</div>

					<div className="relative flex h-32 w-full shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:w-56">
						{info.imageUrl ? (
							<Image
								src={info.imageUrl}
								alt={info.name}
								width={220}
								height={120}
								className="h-auto max-h-full w-auto object-contain"
								draggable={false}
							/>
						) : (
							<Store className="h-12 w-12 text-gray-300" />
						)}
					</div>
				</div>

				{/* Товары бренда */}
				<div className="pt-6">
					<h3 className="mb-4 text-xs font-bold tracking-wide text-black uppercase">
						Товары бренда
					</h3>

					{isLoadingProducts && (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
							{Array.from({ length: 4 }).map((_, index) => (
								<div
									key={index}
									className="flex h-56 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-3"
								>
									<Skeleton className="h-32 w-full rounded-xl bg-gray-200" />
									<Skeleton className="h-4 w-1/2 bg-gray-200" />
									<Skeleton className="h-4 w-3/4 bg-gray-200" />
								</div>
							))}
						</div>
					)}

					{!isLoadingProducts && products.length === 0 && (
						<p className="py-10 text-center text-sm text-gray-500">
							Товары этого бренда пока не добавлены
						</p>
					)}

					{!isLoadingProducts && products.length > 0 && (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
							{products.map((product) => (
								<Link
									key={product.id}
									href={`/catalog/${product.id}`}
									scroll={false}
									className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-3 transition-shadow hover:shadow-md md:p-4"
								>
									<div className="relative mb-3 flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50/50 sm:h-36">
										{product.imageUrl ? (
											<Image
												src={product.imageUrl}
												alt={product.name}
												fill
												sizes="(max-width: 640px) 50vw, 25vw"
												className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
												Нет фото
											</div>
										)}
									</div>

									{product.defaultPrice != null && (
										<div className="text-sm font-bold text-black font-russo">
											от {product.defaultPrice} BYN
										</div>
									)}
									<h4 className="mt-1 line-clamp-2 font-sans text-xs leading-tight text-gray-600">
										{product.name}
									</h4>
								</Link>
							))}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
