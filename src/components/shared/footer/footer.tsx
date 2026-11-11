'use client'
import {Container} from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import * as React from "react";
import useIsMobile from "@/hooks/use-is-mobile";
import {CallbackDialog} from "@/components/shared/callback/callback.dialog";
import {PRIVACY_POLICY_URL} from "@/lib/constants";


export function Footer () {
    const {isMobile, isLoading} = useIsMobile()
    if (isLoading) {
        return (
            <Skeleton/>
        )
    }


    return (
        <Container className="bg-[#2C2C31] rounded-tr-[20px] rounded-tl-[20px]">
            {isMobile ? (
               <>
                   <div className={"px-5.5 py-5 "}>
                       <div className={'flex justify-between'}>
                           <div>
                               <Link href={'/'}>
                                   <Image src={'/footerLogo.png'} alt={'footer-log'} width={160} height={60}/>
                               </Link>
                               <p className={"text-sm"}>
                                   ИП Креер Эдгар Викторович<br/>
                                   УНП 791354984<br/>
                                   Могилевская обл., г. Бобруйск, ул.<br/>
                                   BY36ALFA30132E83210010270000<br/>
                                   ЗАО “Альфа-Банк”<br/>
                               </p>
                           </div>
                           <div className={'flex flex-col absolute right-6 gap-4 translate-y-1'}>
                               <div
                                   className={"p-3.75 bg-[#46464E] rounded-[20px] hover:bg-[#EC5B4D] active:bg-[#D83C2D]"}>
                                   <Link href="https://www.instagram.com/korax_nutrition?igsi=MXF6emE0c3hmejJkbw%3D%3D"
                                         target={'_blank'}>
                                       <Image src={'/instagram.svg'} alt={'instagram'} width={25} height={25}/>
                                   </Link>
                               </div>
                               <div
                                   className={"p-3.75 bg-[#46464E] rounded-[20px] hover:bg-[#EC5B4D] active:bg-[#D83C2D]"}>
                                   <Link href="https://www.instagram.com/korax_nutrition?igsi=MXF6emE0c3hmejJkbw%3D%3D"
                                         target={'_blank'}>
                                       <Image src={'/telegram.svg'} alt={'instagram'} width={25} height={25}/>
                                   </Link>
                               </div>
                               <div
                                   className={"p-3.75 bg-[#46464E] rounded-[20px] hover:bg-[#EC5B4D] active:bg-[#D83C2D]"}>
                                   <Link href="https://www.instagram.com/korax_nutrition?igsi=MXF6emE0c3hmejJkbw%3D%3D"
                                         target={'_blank'}>
                                       <Image src={'/tiktok.svg'} alt={'instagram'} width={25} height={25}/>
                                   </Link>
                               </div>
                           </div>
                       </div>
                       <div className={'flex flex-col gap-2 mt-3.75'}>
                           <h2 className={'text-xl font-bold'}>Контакты</h2>
                           <p className={"text-xs"}>Адрес: ул. Братская 14 Спортивный зал Адреналин</p>
                           <p className={"text-xs"}>ул. 50 лет ВЛКСМ Д.5</p>
                           <p className={"text-xs"}>Email: <Link href={'mailto:edalinb@mail.ru'} target={"_blank"}>edalinb@mail.ru</Link></p>
                           <p className={"text-xs"}>Номер телефона: +375 (29) 535 2079</p>
                            <CallbackDialog
                                trigger={
                                    <Button className={'px-6.25 py-3.75 rounded-[13px] text-sm'}>Заказать звонок</Button>
                                }
                            />
                       </div>
                        <div className={'flex flex-col gap-2 mt-3'}>
                            <h2 className={'font-bold text-xl text-center'}>Режим работы</h2>
                            <p className={'text-[14px] text-center'}>Понедельник - пятница: 10:00-23:00</p>
                            <p className={'text-[14px] text-center'}>Суббота - воскресенье: 9:00 - 21:00</p>
                        </div>
                        <div className="mt-4 overflow-x-auto overflow-y-hidden rounded-[13px] bg-white px-3 pt-2.5 pb-3 pretty-scrollbar-on-light">
                            <Image src="/paid.png" alt="Способы оплаты" width={13637} height={1377} className="h-14 w-auto max-w-none"/>
                        </div>
                         <div className={'border border-white w-82.75 mx-auto mt-4'}/>
                        <div className={"flex justify-center mt-3.75"}>
                            <Link
                                href={PRIVACY_POLICY_URL}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                className={'text-[12px] text-white/70 underline underline-offset-2 hover:text-white'}
                            >
                                Политика об обработке персональных данных
                            </Link>
                        </div>
                   </div>

               </>
                 ) : (
                <>
                    <div className={'flex justify-around py-5'}>
                        <div>
                            <Link href={'/'}>
                                <Image src={'/footerLogo.png'} alt={'footer-logo'} width={337} height={127}/>
                            </Link>
                            <p className={"mt-5 font-[16px]"}>
                                ИП Креер Эдгар Викторович<br/>
                                УНП 791354984<br/>
                                Могилевская обл., г. Бобруйск, ул.<br/>
                                BY36ALFA30132E83210010270000<br/>
                                ЗАО “Альфа-Банк”<br/>
                            </p>
                        </div>
                        <div className={'flex flex-col  justify-around'}>
                            <h2 className={'font-bold'}>Режим работы</h2>
                            <p className={'text-[16px]'}>Понедельник - пятница:<br/> 10:00-23:00</p>
                            <p className={'text-[16px]'}>Суббота - воскресенье:<br/> 9:00 - 21:00</p>
                            <h2>Наши соцсети</h2>
                            <div className={'flex justify-between'}>
                                <div
                                    className={"p-3.75 bg-[#46464E] rounded-[20px] hover:bg-[#EC5B4D] active:bg-[#D83C2D]"}>
                                    <Link href="https://www.instagram.com/korax_nutrition?igsi=MXF6emE0c3hmejJkbw%3D%3D"
                                          target={'_blank'}>
                                        <Image src={'/instagram.svg'} alt={'instagram'} width={25} height={25}/>
                                    </Link>
                                </div>
                                <div
                                    className={"p-3.75 bg-[#46464E] rounded-[20px] hover:bg-[#EC5B4D] active:bg-[#D83C2D]"}>
                                    <Link href="https://www.instagram.com/korax_nutrition?igsi=MXF6emE0c3hmejJkbw%3D%3D"
                                          target={'_blank'}>
                                        <Image src={'/telegram.svg'} alt={'instagram'} width={25} height={25}/>
                                    </Link>
                                </div>
                                <div
                                    className={"p-3.75 bg-[#46464E] rounded-[20px] hover:bg-[#EC5B4D] active:bg-[#D83C2D]"}>
                                    <Link href="https://www.instagram.com/korax_nutrition?igsi=MXF6emE0c3hmejJkbw%3D%3D"
                                          target={'_blank'}>
                                        <Image src={'/tiktok.svg'} alt={'instagram'} width={25} height={25}/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={'flex flex-col justify-around '}>
                            <h2 className={'font-bold'}>Контакты</h2>
                            <p className={"text-[16px]"}>Адрес: ул. Братская 14 <br/>
                                Спортивный зал Адреналин</p>
                            <p className={"text-[16px]"}>ул. 50 лет ВЛКСМ Д.5</p>
                            <p className={"text-[16px]"}>Email: <Link href={'mailto:edalinb@mail.ru'}
                                                                      target={"_blank"}>edalinb@mail.ru</Link></p>
                            <p className={"text-[16px]"}>Номер телефона:<br/>
                                +375 (29) 535 2079</p>
                            <CallbackDialog
                                trigger={
                                    <Button className={'px-6.25 py-3.75 rounded-[13px] text-[14px]'}>Заказать звонок</Button>
                                }
                            />
                        </div>
                    </div>
                    {/* Платёжные логотипы: тёмные на прозрачном фоне → белая подложка */}
                    <div className="flex justify-center px-6 py-4">
                        <div className="w-full max-w-150 rounded-[13px] bg-white px-8 py-3">
                            <Image src="/paid.png" alt="Способы оплаты" width={13637} height={1377} className="h-auto w-full" sizes="(max-width: 1024px) 100vw, 600px"/>
                        </div>
                    </div>
                    <div className={'w-300  mx-auto border border-solid border-white'}/>
                    <div className={'flex flex-col items-center gap-2 mt-5 mb-7.5'}>
                        <p className={'text-[16px]'}>Доставка по всему Минску</p>
                        <Link
                            href={PRIVACY_POLICY_URL}
                            target={'_blank'}
                            rel={'noopener noreferrer'}
                            className={'text-[14px] text-white/70 underline underline-offset-2 hover:text-white'}
                        >
                            Политика об обработке персональных данных
                        </Link>
                    </div>
                </>
            )}
        </Container>
    )
}