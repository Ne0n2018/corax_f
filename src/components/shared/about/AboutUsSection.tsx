import Image from 'next/image'

// Прорезь в маске изображения: прямоугольник 160×120 px.
// На границе прорези с краем кадра скругляется сам материал изображения
// (выпуклая дуга радиуса 25px срезает острый «мыс»). Внутренний угол
// прорези — обычный скруглённый угол выреза (вогнутая дуга, радиус 25px).
const CUT_W = 160
const CUT_H = 120
const CUT_R = 25

// SVG вычитаемой формы (заливка — непрозрачная, маска переводит её в «дыру»).
// viewBox с отступом 25px слева/снизу: форма на 25px шире прорези с той
// стороны, где нужно скруглить угол самого изображения на границе кадра.
const cutShape = (viewBox: string, d: string) =>
    `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${CUT_W + CUT_R}" height="${CUT_H + CUT_R}">` +
        `<path d="${d}" fill="#fff"/></svg>`
    )}")`

// Верхний правый вырез: скругления материала в углах, прижатых к верхней
// и правой границам кадра; внутренний угол (левый нижний) — скругление выреза
const CUT_TOP = cutShape(
    `${-CUT_R} 0 ${CUT_W + CUT_R} ${CUT_H + CUT_R}`,
    `M 0 0 H ${CUT_W} V ${CUT_H + CUT_R} A ${CUT_R} ${CUT_R} 0 0 0 ${CUT_W - CUT_R} ${CUT_H} H ${CUT_R} A ${CUT_R} ${CUT_R} 0 0 1 0 ${CUT_H - CUT_R} V ${CUT_R} A ${CUT_R} ${CUT_R} 0 0 0 ${-CUT_R} 0 Z`
)
// Нижний левый вырез: зеркальная копия (поворот на 180°)
const CUT_BOTTOM = cutShape(
    `0 ${-CUT_R} ${CUT_W + CUT_R} ${CUT_H + CUT_R}`,
    `M ${CUT_W} ${CUT_H} H 0 V ${-CUT_R} A ${CUT_R} ${CUT_R} 0 0 0 ${CUT_R} 0 H ${CUT_W - CUT_R} A ${CUT_R} ${CUT_R} 0 0 1 ${CUT_W} ${CUT_R} V ${CUT_H - CUT_R} A ${CUT_R} ${CUT_R} 0 0 0 ${CUT_W + CUT_R} ${CUT_H} Z`
)

// Слои: вырез сверху справа, вырез снизу слева, белый базовый прямоугольник (весь кадр).
// mask-composite: exclude вычитает каждый вырез из результата ниже.
const IMAGE_MASK: React.CSSProperties = {
    WebkitMaskImage: `${CUT_TOP}, ${CUT_BOTTOM}, linear-gradient(#fff, #fff)`,
    WebkitMaskSize: `${CUT_W + CUT_R}px ${CUT_H + CUT_R}px, ${CUT_W + CUT_R}px ${CUT_H + CUT_R}px, 100% 100%`,
    WebkitMaskPosition: 'right 0 top 0, left 0 bottom 0, 0 0',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskComposite: 'xor, xor, source-over',
    maskImage: `${CUT_TOP}, ${CUT_BOTTOM}, linear-gradient(#fff, #fff)`,
    maskSize: `${CUT_W + CUT_R}px ${CUT_H + CUT_R}px, ${CUT_W + CUT_R}px ${CUT_H + CUT_R}px, 100% 100%`,
    maskPosition: 'right 0 top 0, left 0 bottom 0, 0 0',
    maskRepeat: 'no-repeat',
    maskComposite: 'exclude, exclude, add',
}

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
				{/* Фотография магазина: на десктопе кадр фиксирован 566×727 (w-141.5/h-181.75)
					и отцентрован по высоте, по ширине отстоит на 56px от левого края формы */}
				<div className="relative order-1 mx-auto w-full max-w-130 lg:order-1 lg:mx-0 lg:w-141.5 lg:max-w-none lg:shrink-0 lg:self-center">
					<div className="relative aspect-4/3 w-full overflow-hidden rounded-[25px] lg:aspect-auto lg:h-181.75">
						{/* Маска лежит на отдельном слое: она «прокусывает» кадр,
							а rounded+overflow контейнера держат скругление углов */}
						<div className="absolute inset-0 bg-[#1d1c1a]" style={IMAGE_MASK}>
							<Image
								src="/about.png"
								alt="Наш магазин Corax"
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 566px"
								className="object-cover"
								draggable={false}
							/>
						</div>

						{/* Подписи без собственного фона: блоки совпадают с вырезами
							по размеру и позиции, текст центрируется по центру прорези */}
						<div className="absolute top-0 right-0 z-10 flex h-30 w-40 items-center justify-center">
							<span className="text-xl font-bold tracking-wide text-white whitespace-nowrap">
								Наш магазин
							</span>
						</div>

						<div className="absolute bottom-0 left-0 z-10 flex h-30 w-40 items-center justify-center">
							<span className="text-2xl leading-none font-semibold tracking-[0.08em] text-white uppercase sm:text-3xl">
								Corax
							</span>
						</div>
					</div>
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
