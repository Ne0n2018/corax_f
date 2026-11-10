import Image from 'next/image'

// Прорези в маске изображения: высота общая 120 px, ширина разная —
// верхняя шире, под крупную подпись «Наш магазин», нижняя под «Corax».
// На границе прорези с краем кадра скругляется сам материал изображения
// (выпуклая дуга радиуса 25px срезает острый «мыс»). Внутренний угол
// прорези — обычный скруглённый угол выреза (вогнутая дуга, радиус 25px).
const CUT_W_TOP = 208
const CUT_W_BOTTOM = 160
const CUT_H = 120
const CUT_R = 25

// SVG вычитаемой формы (заливка — непрозрачная, маска переводит её в «дыру»).
// viewBox с отступом 25px: форма на 25px шире прорези с той
// стороны, где нужно скруглить угол самого изображения на границе кадра.
const cutShape = (cutW: number, viewBox: string, d: string) =>
    `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${cutW + CUT_R}" height="${CUT_H + CUT_R}">` +
        `<path d="${d}" fill="#fff"/></svg>`
    )}")`

// Верхний правый вырез: скругления материала в углах, прижатых к верхней
// и правой границам кадра; внутренний угол (левый нижний) — скругление выреза
const CUT_TOP = cutShape(
    CUT_W_TOP,
    `${-CUT_R} 0 ${CUT_W_TOP + CUT_R} ${CUT_H + CUT_R}`,
    `M 0 0 H ${CUT_W_TOP} V ${CUT_H + CUT_R} A ${CUT_R} ${CUT_R} 0 0 0 ${CUT_W_TOP - CUT_R} ${CUT_H} H ${CUT_R} A ${CUT_R} ${CUT_R} 0 0 1 0 ${CUT_H - CUT_R} V ${CUT_R} A ${CUT_R} ${CUT_R} 0 0 0 ${-CUT_R} 0 Z`
)
// Нижний левый вырез: та же форма, зеркальная по центру кадра (поворот на 180°)
const CUT_BOTTOM = cutShape(
    CUT_W_BOTTOM,
    `0 ${-CUT_R} ${CUT_W_BOTTOM + CUT_R} ${CUT_H + CUT_R}`,
    `M ${CUT_W_BOTTOM} ${CUT_H} H 0 V ${-CUT_R} A ${CUT_R} ${CUT_R} 0 0 0 ${CUT_R} 0 H ${CUT_W_BOTTOM - CUT_R} A ${CUT_R} ${CUT_R} 0 0 1 ${CUT_W_BOTTOM} ${CUT_R} V ${CUT_H - CUT_R} A ${CUT_R} ${CUT_R} 0 0 0 ${CUT_W_BOTTOM + CUT_R} ${CUT_H} Z`
)

// Слои: вырез сверху справа, вырез снизу слева, белый базовый прямоугольник (весь кадр).
// mask-composite: exclude вычитает каждый вырез из результата ниже.
// Размеры умножаются на --cut-k (задаётся на контейнере кадра): на мобилке вырезы
// меньше, чтобы кадр был лучше виден, на десктопе --cut-k:1 — размеры как в макете.
// SVG тянется под mask-size целиком, поэтому форма и все радиусы сжимаются
// пропорционально; сквозь вырез виден тот же #2C2C31, что и за кадром,
// поэтому расхождение радиуса выреза с скруглением рамки не даёт видимой щели.
const cutSize = (w: number, h: number) =>
    `calc(var(--cut-k) * ${w}px) calc(var(--cut-k) * ${h}px)`

const IMAGE_MASK: React.CSSProperties = {
    WebkitMaskImage: `${CUT_TOP}, ${CUT_BOTTOM}, linear-gradient(#fff, #fff)`,
    WebkitMaskSize: `${cutSize(CUT_W_TOP + CUT_R, CUT_H + CUT_R)}, ${cutSize(CUT_W_BOTTOM + CUT_R, CUT_H + CUT_R)}, 100% 100%`,
    WebkitMaskPosition: 'right 0 top 0, left 0 bottom 0, 0 0',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskComposite: 'xor, xor, source-over',
    maskImage: `${CUT_TOP}, ${CUT_BOTTOM}, linear-gradient(#fff, #fff)`,
    maskSize: `${cutSize(CUT_W_TOP + CUT_R, CUT_H + CUT_R)}, ${cutSize(CUT_W_BOTTOM + CUT_R, CUT_H + CUT_R)}, 100% 100%`,
    maskPosition: 'right 0 top 0, left 0 bottom 0, 0 0',
    maskRepeat: 'no-repeat',
    maskComposite: 'exclude, exclude, add',
}

// Размер блока подписи = сама прорезь (без запаса на скругления за краем кадра),
// тот же --cut-k, что и у маски: текст остаётся по центру выреза.
const labelBox = (w: number): React.CSSProperties => ({
    width: `calc(var(--cut-k) * ${w}px)`,
    height: `calc(var(--cut-k) * ${CUT_H}px)`,
})

export const AboutUsSection = () => {
	return (
		<section className="relative z-20 min-h-150 rounded-t-[20px] rounded-bl-[20px] bg-[#2C2C31] pt-14 pb-16 sm:pt-16 sm:pb-20 lg:aspect-1188/847 lg:min-h-0 lg:rounded-none lg:bg-transparent lg:pt-0 lg:pb-0">
			{/* Мобильный стык с белым блоком «Бренды» — тот же, что на десктопе:
				справа чёрный блок опускается на 70px ниже (выступ), слева — нет (вырез),
				между ними диагональный шов со скруглёнными углами.
				Нижний правый угол основного прямоугольника срезан (rounded-br-none),
				его роль берёт на себя выступ. Смещён на -1px, чтобы не было волосного шва. */}
			<svg
				aria-hidden
				viewBox="0 0 375 70"
				preserveAspectRatio="none"
				className="pointer-events-none absolute inset-x-0 top-[calc(100%-1px)] block h-17.5 w-full lg:hidden"
			>
				<path
					d="M 150 0 C 178 0 205 70 233 70 H 355 Q 375 70 375 50 V 0 Z"
					fill="#2C2C31"
				/>
			</svg>

			{/* Фон секции (десктоп): тёмная форма с тем же швом внизу */}
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
				{/* Фотография магазина: на мобилке идёт вторым блоком и растянута на всю ширину
					при фиксированной высоте 417px — она выше суммарной высоты двух вырезов
					маски (2×120px), так что между прорезями остаётся материал кадра.
					На десктопе кадр фиксирован 566×727 (w-141.5/h-181.75) и отцентрован по высоте */}
				<div className="relative order-2 w-full [--cut-k:0.62] sm:[--cut-k:0.75] lg:order-1 lg:w-141.5 lg:max-w-none lg:shrink-0 lg:self-center lg:[--cut-k:1]">
					<div className="relative h-104.25 w-full overflow-hidden rounded-[25px] lg:h-181.75">
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
							по размеру и позиции, текст центрируется по центру прорези.
							Размеры заданы через тот же --cut-k, что и маска, поэтому
							масштаб выреза и размер текста меняются синхронно.
							Верхний блок шире — под CUT_W_TOP */}
						<div
							className="absolute top-0 right-0 z-10 flex items-center justify-center"
							style={labelBox(CUT_W_TOP)}
						>
							<span className="text-base font-bold tracking-wide text-white whitespace-nowrap sm:text-lg lg:text-xl">
								Наш магазин
							</span>
						</div>

						<div
							className="absolute bottom-0 left-0 z-10 flex items-center justify-center"
							style={labelBox(CUT_W_BOTTOM)}
						>
							<span className="text-lg leading-none font-semibold tracking-[0.08em] text-white uppercase sm:text-2xl lg:text-3xl">
								Corax
							</span>
						</div>
					</div>
				</div>

				{/* Текстовый блок: на мобилке идёт первым; на десктопе — справа, тянется на всю высоту формы */}
				<div className="order-1 w-full max-w-160 lg:order-2 lg:flex lg:max-w-none lg:flex-1 lg:flex-col lg:justify-center lg:self-stretch lg:bg-[url('/dotted.png')] lg:bg-cover lg:bg-center lg:bg-no-repeat lg:px-10 lg:py-10">
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
