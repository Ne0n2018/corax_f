'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { useProviderStore } from '@/store/provider.store'
import type { PublicProvider } from '@/types/provider'
import { BrandDialog } from './BrandDialog'

const TOP_EDGE_PATH =
	'M562.968 0C570.889 0 578.064 4.67504 581.264 11.9213L601.636 58.059C604.841 65.3153 612.03 69.9923 619.963 69.9803L1179.97 69.1338C1191.03 69.1171 1200 78.0763 1200 89.1338V1473C1200 1484.05 1191.05 1493 1180 1493H20C8.95429 1493 0 1484.05 0 1473V20C0 8.9543 8.95431 0 20 0H562.968Z'

const BRAND_DESCRIPTION_MAX = 80

interface BrandCardProps {
	name: string
	imageUrl?: string | null
	description?: string | null
	onOpen: () => void
}

function BrandCard({ name, imageUrl, description, onOpen }: BrandCardProps) {
	const cardRef = useRef<HTMLElement>(null)

	const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			onOpen()
		}
	}

	return (
		<article
			ref={cardRef}
			role="button"
			tabIndex={0}
			onClick={onOpen}
			onKeyDown={handleKeyDown}
			className="relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#e0e0e0] bg-white transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
		>
			{/* Логотип бренда */}
			<div className="relative flex min-h-65 items-center justify-center px-8 pt-8 sm:min-h-80 sm:px-12">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={name}
						width={400}
						height={240}
						className="h-auto w-full object-contain"
						draggable={false}
					/>
				) : (
					<span className="text-center text-2xl font-bold tracking-wide text-[#111317]">
						{name}
					</span>
				)}
			</div>

			{/* Разделитель */}
			<div className="h-px bg-[#e0e0e0]" />

			{/* Текстовый блок */}
			<div className="flex flex-1 flex-col gap-3 p-6 sm:p-8">
				<h3 className="text-xl leading-tight font-bold text-[#111317]">{name}</h3>

				{description && (
					<p className="line-clamp-3 text-sm leading-relaxed text-[#737373]">
						{description.length > BRAND_DESCRIPTION_MAX
							? description.slice(0, BRAND_DESCRIPTION_MAX)
							: description}
					</p>
				)}

				<span className="mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#111317] transition-colors group-hover:text-brand-red">
					Узнать подробнее
					<ChevronRight className="w-4 h-4" />
				</span>
			</div>
		</article>
	)
}

export const AboutBrandsSection = () => {
	const publicProviders = useProviderStore((s) => s.publicProviders)
	const isPublicLoading = useProviderStore((s) => s.isPublicLoading)
	const getPublicProviders = useProviderStore((s) => s.getPublicProviders)

	const [selectedBrand, setSelectedBrand] = useState<PublicProvider | null>(null)

	useEffect(() => {
		void getPublicProviders()
	}, [getPublicProviders])

	const brands = publicProviders.filter((provider) => provider.name)

	return (
		// На десктопе секция заходит под низ тёмного блока «О нас», но с зазором 15px вдоль стыка
		<section className="relative z-10 mb-10 lg:-mt-[calc(6.6%_-_23px)]">
			{/* Верхняя кромка белого блока: вырез справа под выступ тёмной формы */}
			<div
				aria-hidden
				className="relative hidden w-full lg:block"
				style={{ aspectRatio: '1200 / 90' }}
			>
				<svg
					viewBox="0 0 1200 90"
					preserveAspectRatio="none"
					className="pointer-events-none absolute inset-0 h-full w-full"
				>
					<path d={TOP_EDGE_PATH} fill="#ffffff" />
				</svg>
			</div>

			{/* Белое тело блока */}
			<div className="rounded-t-[40px] bg-white px-4 pb-14 pt-12 sm:px-8 lg:rounded-none lg:px-14 lg:pt-12">
				{/* Заголовок: на десктопе выносится в верхний левый выступ белой формы */}
				<div className="flex flex-col gap-1 pb-2 lg:absolute lg:top-0 lg:left-0 lg:px-14 lg:pt-7 lg:pb-0">
					<h2 className="font-sans text-[24px] leading-none font-bold text-[#111317] sm:text-[28px]">
						Бренды
					</h2>
					<p className="font-sans text-sm leading-relaxed text-[#737373]">
						Здесь вы можете ознакомиться с некоторыми брендами
					</p>
				</div>

				<div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-0 lg:grid-cols-2">
					{isPublicLoading && !brands.length &&
						Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className="flex h-95 items-center justify-center rounded-3xl border border-[#e0e0e0] bg-white"
							>
								<div className="h-4 w-32 animate-pulse rounded-lg bg-[#e0e0e0]" />
							</div>
						))}

					{!isPublicLoading && !brands.length && (
						<p className="col-span-full py-16 text-center text-sm text-[#737373]">
							Список брендов временно недоступен
						</p>
					)}

					{brands.map((brand) => (
						<BrandCard
							key={brand.id}
							name={brand.name}
							imageUrl={brand.imageUrl}
							description={brand.description}
							onOpen={() => setSelectedBrand(brand)}
						/>
					))}
				</div>
			</div>

			<BrandDialog
				brand={selectedBrand}
				isOpen={Boolean(selectedBrand)}
				onClose={() => setSelectedBrand(null)}
			/>
		</section>
	)
}


