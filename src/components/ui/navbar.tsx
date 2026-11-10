"use client"

import * as React from "react"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {NavigationMenu, NavigationMenuItem, NavigationMenuList} from "@/components/ui/navigation-menu"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {AuthDialog, AuthModal} from "@/components/shared/header/auth.dialog"
import {Container} from "@/components/ui/container"
import {useUserStore} from "@/store/user.store"
import Link from "next/link"
import {usePathname} from "next/navigation"
import Image from "next/image"
import {ArrowDown, UserRound} from "lucide-react"
import {AccountDialog, AccountModal} from "@/components/shared/header/account.dialog"
import {CartSheet} from "@/components/shared/cart/cart-sheet"
import {useCartStore} from "@/store/cart.store"
import useIsMobile from "@/hooks/use-is-mobile"
import {toast} from "sonner"
import {isAuthBlockedByCookieConsent, useCookieConsentStore} from "@/store/cookie-consent.store"
import {useNotificationStore} from "@/store/notification.store"
import {NotificationBadge} from "@/components/shared/notification-badge"

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
    <svg
        aria-label="Menu"
        className={cn("pointer-events-none", className)}
        fill="none"
        height={16}
        role="img"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={16}
        xmlns="http://www.w3.org/2000/svg"
        {...(props as any)}
    >
        <path
            className="origin-center -translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
            d="M4 12L20 12"
        />
        <path
            className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
            d="M4 12H20"
        />
        <path
            className="origin-center translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
            d="M4 12H20"
        />
    </svg>
)

export interface NavbarNavLink {
    href: string
    label: string
    active?: boolean
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
    logo?: React.ReactNode
    logoHref?: string
    navigationLinks?: NavbarNavLink[]
    signInText?: string
    signInHref?: string
    ctaText?: string
    ctaHref?: string
    onSignInClick?: () => void
    onCtaClick?: () => void
}

const defaultNavigationLinks: NavbarNavLink[] = [
    { href: "/", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: "/about", label: "O нас" },
    { href: "/contacts", label: "Контакты" },
]

// Активным считаем пункт, совпадающий с текущим путём (для "/" — строгое совпадение)
const isLinkActive = (href: string, pathname: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

// Белая «обёртка» логотипа в неавторизованном состоянии (десктоп).
// Геометрия повторяет выступы секций (см. sectionTab.tsx): левый край,
// скругление 22px сверху слева, горизонтальная верхняя грань и S-образный
// скос справа. У кривой горизонтальные касательные с обоих концов — она
// плавно выходит из верхней грани и так же плавно входит в нижнюю, а нижняя
// грань ложится точно на верхний край первой секции. Плашка на 1px ниже,
// чтобы не было волосного шва.
// Ширина 380px: логотип 311px + pl-6, скос начинается сразу за логотипом
// и заканчивается до начала меню (навигация не перекрывается).
const LOGO_PLATE_VIEWBOX = "0 0 380 95"
const LOGO_PLATE_PATH = "M 0 95 V 22 Q 0 0 22 0 H 335 C 350 0 365 95 380 95 Z"


export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
    (
        {
            className,
            navigationLinks = defaultNavigationLinks,
            ...props
        },
        ref,
    ) => {
        const [accountMode, setAccountMode] = useState<AccountModal>(null)
        const [authMode, setAuthMode] = useState<AuthModal>(null)
        const [isCartOpen, setIsCartOpen] = useState(false)
        // Контролируемое мобильное меню, чтобы закрывать его при выборе пункта
        const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

        const pathname = usePathname()

        const { user } = useUserStore()
        const { isMobile } = useIsMobile()
        const { cart, getCart } = useCartStore()
        const unread = useNotificationStore((state) => state.unread)

        React.useEffect(() => {
            if (user) {
                getCart()
            }
        }, [user, getCart])

        const cartTotalItems = cart?.CartItem?.reduce((acc, item) => acc + item.quantity, 0) || 0

        // Отказ от cookie-файлов блокирует вход и регистрацию
        const handleAuthClick = (mode: AuthModal) => {
            if (isAuthBlockedByCookieConsent()) {
                toast.error("Чтобы войти в аккаунт, примите использование cookie-файлов")
                // Показываем плашку заново, чтобы пользователь мог изменить решение
                useCookieConsentStore.getState().resetConsent()
                return
            }
            setAuthMode(mode)
        }

        return (
            <header
                className={cn(
                    " top-0 z-50 w-full mt-1 transition-all duration-300 **:no-underline",

                )}
                ref={ref}
                {...props}
            >
                <Container>
                    <div className={cn("relative flex min-h-21.25 py-2 max-w-screen-2xl items-center justify-between", isMobile && 'bg-[#2C2C31] rounded-[15px]', user && "bg-[#2C2C31] px-6 md:px-7.5 rounded-[20px]", className )}>
                        {/* Белая обёртка логотипа: только десктоп и неавторизованное
                            состояние (на мобилке шапка — тёмная плашка в обоих состояниях).
                            -z-10: плашка под логотипом, но поверх фона страницы */}
                        {!user && !isMobile && (
                            <svg
                                aria-hidden
                                viewBox={LOGO_PLATE_VIEWBOX}
                                preserveAspectRatio="none"
                                className="pointer-events-none absolute left-0 top-0 -z-10 hidden h-[calc(100%+1px)] w-95 drop-shadow-sm md:block"
                            >
                                <path d={LOGO_PLATE_PATH} fill="#ffffff" />
                            </svg>
                        )}

                        {/* Left side */}
                        <div className="flex items-center gap-2">
                            {isMobile && (
                                <Popover open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <PopoverTrigger >
                                        <Button
                                            className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <HamburgerIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-48 p-2">
                                        <NavigationMenu className="max-w-none">
                                            <NavigationMenuList className="flex-col items-start gap-1">
                                                {navigationLinks.map((link, index) => (
                                                    <NavigationMenuItem className="w-full" key={index}>
                                                        <Link
                                                            href={link.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className={cn(
                                                                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer no-underline",
                                                                isLinkActive(link.href, pathname)
                                                                    ? "bg-accent text-accent-foreground"
                                                                    : "text-foreground/80",
                                                            )}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    </NavigationMenuItem>
                                                ))}
                                            </NavigationMenuList>
                                        </NavigationMenu>
                                    </PopoverContent>
                                </Popover>
                            )}

                            {/* Main nav */}
                            <div className="flex items-center gap-14.75">
                                {isMobile ? (
                                    <>
                                        <Link href={'/'}>
                                            <Image src={'/footerLogo.png'} alt={'mobile-header-logo'} width={114} height={43} />
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/"
                                        className={cn("flex items-center shrink-0", !user && "md:pl-6")}
                                    >
                                        <Image
                                            src={user ? "/logoAuth.png" : "/logo.png"}
                                            alt="logo-text"
                                            width={user ? 173 : 311}
                                            height={user ? 65 : 79}
                                            priority
                                            // Штатный вордмарк лежит в файле белым, поэтому на
                                            // белой обёртке он перекрашивается в чёрный (brightness-0)
                                            className={!user ? "md:brightness-0" : undefined}
                                        />
                                    </Link>
                                )}

                                {/* Navigation menu */}
                                {!isMobile && (
                                    <NavigationMenu className="flex">
                                        <NavigationMenuList className="gap-2">
                                            {navigationLinks.map((link, index) => (
                                                <NavigationMenuItem key={index}>
                                                    <Link
                                                        href={link.href}
                                                        className={cn(
                                                            "group inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer no-underline",
                                                            isLinkActive(link.href, pathname)
                                                                ? "text-[#FFFFFF8C]"
                                                                : "text-white hover:text-[#FFFFFF8C]",
                                                        )}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </NavigationMenuItem>
                                            ))}
                                        </NavigationMenuList>
                                    </NavigationMenu>
                                )}
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => setIsCartOpen(true)}
                                        className="relative px-2.25 py-4.25 bg-[#46464E] hover:bg-[#575760] rounded-xl transition-colors cursor-pointer"
                                        aria-label="Корзина"
                                    >
                                        <ArrowDown size={17} />
                                        {cartTotalItems > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-[#D83C2D] text-white text-[10px] font-bold min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center ring-2 ring-[#2C2C31]">
                                                {cartTotalItems > 99 ? '99+' : cartTotalItems}
                                            </span>
                                        )}
                                    </Button>
                                    <Button
                                        className="relative overflow-visible p-2.5 bg-[#46464E] rounded-xl"
                                        onClick={() => setAccountMode("account")}
                                        aria-label="Меню аккаунта"
                                    >
                                        <UserRound />
                                        <NotificationBadge count={unread} />
                                    </Button>
                                </div>
                            ) : isMobile ? (
                                <Button
                                    className="bg-[#4C4C55] text-white text-[12px] py-4.25 px-7.25 rounded-[13px] hover:bg-gray-100"
                                    onClick={() => handleAuthClick("Login")}
                                >
                                    Войти
                                </Button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Button
                                        className="text-black bg-white py-4.25 px-7.25 rounded-[13px] hover:bg-gray-100"
                                        onClick={() => handleAuthClick("Login")}
                                    >
                                        Войти
                                    </Button>
                                    <Button
                                        className="py-4 px-5.5 bg-[#38383D] rounded-[13px] text-[13px] hover:bg-[#4a4a50]"
                                        onClick={() => handleAuthClick("Register")}
                                    >
                                        Зарегистрироваться
                                    </Button>
                                </div>
                            )}

                            <AuthDialog
                                mode={authMode}
                                onModeChange={(newMode) => setAuthMode(newMode)}
                                onClose={() => setAuthMode(null)}
                            />
                            <AccountDialog
                                mode={accountMode}
                                onModeChange={(newMode) => setAccountMode(newMode)}
                                onClose={() => setAccountMode(null)}
                            />
                            <CartSheet
                                isOpen={isCartOpen}
                                onOpenChange={setIsCartOpen}
                            />
                        </div>
                    </div>
                </Container>
            </header>
        )
    },
)

Navbar.displayName = "Navbar"

export { HamburgerIcon }