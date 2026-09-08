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
import Image from "next/image"
import {ArrowDown, UserRound} from "lucide-react"
import {AccountDialog, AccountModal} from "@/components/shared/header/account.dialog"
import useIsMobile from "@/hooks/use-is-mobile"

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
    { href: "/", label: "Главная", active: true },
    { href: "catalog", label: "Каталог" },
    { href: "about", label: "O нас" },
    { href: "contacts", label: "Контакты" },
]

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

        const { user } = useUserStore()
        const {isMobile} = useIsMobile()

        return (
            <header
                className={cn(
                    "sticky top-0 z-50 w-full mt-1 transition-all duration-300 **:no-underline",

                )}
                ref={ref}
                {...props}
            >
                <Container>
                    <div className={cn("flex min-h-21.25 py-2 max-w-screen-2xl items-center justify-between", isMobile && 'bg-[#2C2C31] rounded-[15px]', user && "bg-[#2C2C31] px-6 md:px-7.5 rounded-[20px]"  )}>
                        {/* Left side */}
                        <div className="flex items-center gap-2">
                            {isMobile && (
                                <Popover>
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
                                                            className={cn(
                                                                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer no-underline",
                                                                link.active
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
                                    <>
                                        <Link href="/" className="flex items-center shrink-0">
                                            <Image
                                                src={user ? "/logoAuth.png" : "/logo.png"}
                                                alt="logo-text"
                                                width={user ? 173 : 311}
                                                height={user ? 65 : 79}
                                                priority
                                            />
                                        </Link>
                                    </>
                                )}

                                {/* Navigation menu */}
                                {!isMobile && (
                                    <NavigationMenu className="flex">
                                        <NavigationMenuList className="gap-2">
                                            {navigationLinks.map((link, index) => (
                                                <NavigationMenuItem key={index}>
                                                    <a
                                                        href={link.href}
                                                        className={cn(
                                                            "group inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer no-underline",
                                                            link.active
                                                                ? "text-[#FFFFFF8C]"
                                                                : "text-white hover:text-[#FFFFFF8C]",
                                                        )}
                                                    >
                                                        {link.label}
                                                    </a>
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
                                    <Button className="px-2.25 py-4.25 bg-[#46464E] rounded-xl">
                                        <ArrowDown size={17} />
                                    </Button>
                                    <Button
                                        className="p-2.5 bg-[#46464E] rounded-xl"
                                        onClick={() => setAccountMode("account")}
                                    >
                                        <UserRound />
                                    </Button>
                                </div>
                            ) : isMobile ? (
                                <Button
                                    className="bg-[#4C4C55] text-white text-[12px] py-4.25 px-7.25 rounded-[13px] hover:bg-gray-100"
                                    onClick={() => setAuthMode("Login")}
                                >
                                    Войти
                                </Button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Button
                                        className="text-black bg-white py-4.25 px-7.25 rounded-[13px] hover:bg-gray-100"
                                        onClick={() => setAuthMode("Login")}
                                    >
                                        Войти
                                    </Button>
                                    <Button
                                        className="py-4 px-5.5 bg-[#38383D] rounded-[13px] text-[13px] hover:bg-[#4a4a50]"
                                        onClick={() => setAuthMode("Register")}
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
                        </div>
                    </div>
                </Container>
            </header>
        )
    },
)

Navbar.displayName = "Navbar"

export { HamburgerIcon }