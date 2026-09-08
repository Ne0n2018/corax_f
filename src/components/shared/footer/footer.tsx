'use client'
import {Container} from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import * as React from "react";
import useIsMobile from "@/hooks/use-is-mobile";


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
                           <p className={"text-xs"}>Email: <Link href={'mailto:info@gmail.com'} target={"_blank"}>info@gmail.com</Link></p>
                           <p className={"text-xs"}>Номер телефона: +375 (00) 000 00 00</p>
                           <Button className={'px-6.25 py-3.75 rounded-[13px] text-sm'}>Заказать звонок</Button>
                       </div>
                       <div className={'flex flex-col gap-2 mt-3.75'}>
                           <h2 className={'font-bold text-xl text-center'}>Режим работы</h2>
                           <p className={'text-[14px] text-center'}>Понедельник - пятница: 10:00-23:00</p>
                           <p className={'text-[14px] text-center'}>Суббота - воскресенье: 9:00 - 21:00</p>
                       </div>
                       <div className={'border border-white w-82.75 mx-auto mt-5'}/>
                       <div className={"flex justify-center mt-3.75"}>
                           <Link href={'/'} className={'text-[12px]'}>Политика конфеденциальности</Link>
                       </div>
                   </div>

               </>
                ) : (
                <>
                    <div className={'flex justify-around  py-7.5'}>
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
                            <p className={"text-[16px]"}>Email: <Link href={'mailto:info@gmail.com'}
                                                                      target={"_blank"}>info@gmail.com</Link></p>
                            <p className={"text-[16px]"}>Номер телефона:<br/>
                                +375 (00) 000 00 00</p>
                            <Button className={'px-6.25 py-3.75 rounded-[13px] text-[14px]'}>Заказать звонок</Button>
                        </div>
                    </div>
                    <div className={'w-300  mx-auto border border-solid border-white'}/>
                    <div className={'flex flex-row justify-around mt-7.5 mb-9.25'}>
                        <p>Доставка по всему Минску </p>
                        <div/>
                        <div/>
                        <div/>
                        <p>Политика конфеденциальности</p>
                    </div>
                </>
            )}
        </Container>
    )
}