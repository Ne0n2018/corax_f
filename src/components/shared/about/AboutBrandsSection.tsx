'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useProviderStore } from '@/store/provider.store'

export const AboutBrandsSection = () => {
	const publicProviders = useProviderStore((s) => s.publicProviders)
	const isPublicLoading = useProviderStore((s) => s.isPublicLoading)
	const getPublicProviders = useProviderStore((s) => s.getPublicProviders)

	useEffect(() => {
		void getPublicProviders()
	}, [getPublicProviders])

	const brands = publicProviders.filter((provider) => provider.name)

	return (
		// На десктопе секция наезжает на низ тёмного блока «О нас» — выступ формы остаётся сверху справа
		<section className="relative z-10 mb-10 lg:-mt-[5.892%]">
			{/* Белая плашка с закруглением сверху */}
			<div className="relative rounded-t-[40px] bg-white px-4 pb-14 pt-12 sm:px-8 lg:rounded-t-none lg:px-14">
				<div className="flex flex-col gap-1">
					<h2 className="font-russo text-2xl leading-none text-[#111317] uppercase sm:text-3xl">
						Бренды
					</h2>
					<p className="font-mono text-xs text-[#737373] sm:text-sm">
						Здесь вы можете ознакомиться с некоторыми брендами, товары которых являются официальной
						продукцией от производителей
					</p>
				</div>

				<div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{isPublicLoading && !brands.length &&
						Array.from({ length: 8 }).map((_, index) => (
							<div
								key={index}
								className="flex h-24 items-center justify-center rounded-3xl border border-black/5 bg-white p-6"
							>
								<div className="h-3 w-28 animate-pulse rounded-full bg-black/10" />
							</div>
						))}

					{!isPublicLoading && !brands.length && (
						<p className="col-span-full text-center text-sm text-[#737373]">
							Список брендов временно недоступен
						</p>
					)}

					{brands.map((brand) => (
						<article
							key={brand.id}
							className="flex h-24 items-center justify-center gap-3 rounded-3xl border border-black/5 bg-white px-6 py-4 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.6)]"
						>
							{brand.imageUrl ? (
								<div className="relative h-full w-full">
									<Image
										src={brand.imageUrl}
										alt={brand.name}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
										className="object-contain"
										draggable={false}
									/>
								</div>
							) : (
								<span className="text-center text-[15px] leading-tight font-medium tracking-wide text-[#111317] uppercase">
									{brand.name}
								</span>
							)}
						</article>
					))}
				</div>
			</div>
		</section>
	)
}
