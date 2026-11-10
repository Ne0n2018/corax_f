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
    // Единый зазор вдоль всех швов — 15px, как на «О нас» (белый блок под
    // выступом тёмного) и как отступы Container до шапки/подвала (mt/mb-3.75).
    // Выступы соседних секций — это одна и та же кривая, поэтому чтобы между
    // ними был параллельный зазор G, нижнюю секцию надо поднять на
    //   -(выступ - G):  md -(100 - 15) = -85px  |  мобилка -(65 - 15) = -50px
    // Для стыков без выступов (2->3) ставится обычный mt = G.
  return (
      <Container className="mb-3.75">
        <FirstSection isAuthenticated={isAuth}/>
        {/* 1 -> 2: выступы стыкуются (bottom-right + top-left), зазор вдоль шва 15px */}
        <SecondSection className="-mt-12.5 md:-mt-21.25"/>
        {/* 2 -> 3: выступов на стыке нет, обычный зазор 15px */}
        <ThirdSection className="mt-3.75"/>
        {/* 3 -> 4: выступы стыкуются (top-left + bottom-right), зазор вдоль шва 15px */}
        <FourSection className="-mt-12.5 md:-mt-21.25"/>
      </Container>
  )
}
