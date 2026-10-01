import Image from 'next/image'

export const AboutUsSection = () => {
	return (
		<section className="relative z-20 min-h-150 rounded-[20px] bg-[#2C2C31] pt-14 pb-16 sm:pt-16 sm:pb-20 lg:aspect-1188/847 lg:min-h-0 lg:rounded-none lg:bg-transparent lg:pt-0 lg:pb-0">
			{/* Фон секции: тёмная форма с выступом в правом нижнем углу */}
			<svg
				aria-hidden
				viewBox="0 0 1188 847"
				preserveAspectRatio="none"
				className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full drop-shadow-md lg:block"
			>
				<path
					d="M1188 827C1188 838.046 1179.05 847 1168 847H617.145C609.166 847 601.951 842.257 598.786 834.933L578.968 789.067C575.803 781.743 568.588 777 560.609 777H8.00001C-3.04569 777 -12 768.046 -12 757V20C-12 8.95431 -3.04569 0 8 0H1168C1179.05 0 1188 8.95431 1188 20V827Z"
					fill="#2C2C31"
				/>
			</svg>

			<div className="relative mx-auto flex w-full max-w-360 flex-col gap-10 px-4 sm:px-8 lg:h-full lg:flex-row lg:items-stretch lg:gap-16 lg:pl-14 lg:pr-0">
				{/* Фотография магазина */}
				<div className="relative order-1 mx-auto w-full max-w-130 lg:order-1 lg:mx-0 lg:w-110 lg:max-w-none lg:shrink-0 lg:self-center">
					{/* Белая плашка-подложка */}
					<div className="absolute -top-14 -right-3 rounded-3xl bg-[#e9e9e7] px-6 py-3 sm:-right-6">
						<span className="text-sm font-medium tracking-wide text-[#1d1c1a] whitespace-nowrap">
							Наш магазин
						</span>
					</div>

					<div className="relative aspect-4/3 w-full overflow-hidden rounded-[40px] bg-[#1d1c1a]">
						<Image
							src="/about.png"
							alt="Наш магазин Corax"
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 520px"
							className="object-cover"
							draggable={false}
						/>
					</div>

					<span className="absolute bottom-5 left-6 text-2xl leading-none font-semibold tracking-[0.08em] text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:text-3xl">
						Corax
					</span>
				</div>

				{/* Текстовый блок: на десктопе тянется на всю высоту формы и упирается в правую грань */}
				<div className="order-2 w-full max-w-160 lg:order-2 lg:flex lg:max-w-none lg:flex-1 lg:flex-col lg:justify-center lg:self-stretch lg:bg-[url('/dotted.png')] lg:bg-cover lg:bg-center lg:bg-no-repeat lg:px-10 lg:py-10">
					<h1 className="text-[30px] font-russo leading-none font-semibold tracking-wide text-white uppercase sm:text-[38px] lg:text-[44px]">
						О нас
					</h1>

					<div className=" text-[14px] leading-relaxed text-white sm:mt-7  sm:text-base">
						<p>
							Corax — специализированный магазин спортивного питания и нутрицевтиков.
						</p>
						<p>
							Мы работаем с продуктами, которые соответствуют высоким требованиям к составу, качеству
							сырья и производственным стандартам. В нашем ассортименте — тщательно отобранные позиции
							от международных брендов, зарекомендовавших себя на рынке.
						</p>
						<p>Каждый продукт в Corax проходит внутренний отбор по трём критериям:</p>
					</div>

					<ul className="mt-5 space-y-2.5">
						{['Эффективность', 'Безопасность', 'Репутация производителя'].map((item) => (
							<li key={item} className="flex items-center gap-3 text-[15px] text-white/85 sm:text-base">
								<span className="size-1.5 shrink-0 rounded-full bg-white" />
								{item}
							</li>
						))}
					</ul>

					<div className="mt-2 text-[14px] leading-relaxed text-white sm:text-base">
						<p>
							Спортивное питание — это <span className="italic">инструмент</span>.
						</p>
						<p>Качество инструмента определяет результат.</p>
						<p className="pt-2 text-base font-semibold  sm:text-lg">
							Corax. Основа прогресса!
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
