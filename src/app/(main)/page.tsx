'use client'
import {Container} from "@/components/ui/container";
import {FirstSection} from "@/components/shared/main/firstSection";
import {useUserStore} from "@/store/user.store";
import {SecondSection} from "@/components/shared/main/secondSection";
import {ThirdSection} from "@/components/shared/main/thirdSection";
import {FourSection} from "@/components/shared/main/fourSection";


export default function Home() {
    const {isAuth} = useUserStore();
    // Растузовка секций делается отрицательным margin-top, а НЕ bottom:
    // bottom лишь сдвигает секцию визуально, её слот в потоке остаётся на месте,
    // поэтому подвал отъезжал вниз на сумму всех сдвигов.
    //
    // Формула для зазора G между телами соседних секций (выступы 100px / 65px):
    //   md:-mt-(200 - G)   для десктопа
    //      -mt-(130 - G)   для мобилки
    // Для стыков без выступов (2->3) ставится обычный mt = G на обоих брейкпоинтах.
  return (
      <Container>
        <FirstSection isAuthenticated={isAuth}/>
        {/* 1 -> 2: зазор между телами 128px */}
        <SecondSection className="-mt-0.5 md:-mt-18"/>
        {/* 2 -> 3: зазор между телами 10px, выступов на стыке нет */}
        <ThirdSection className="mt-2.5"/>
        {/* 3 -> 4: зазор между телами 127px */}
        <FourSection className="-mt-0.75 md:-mt-18.25"/>
      </Container>
  )
}
