'use client'
import {Container} from "@/components/ui/container";
import {FirstSection} from "@/components/shared/main/firstSection";
import {useUserStore} from "@/store/user.store";
import {SecondSection} from "@/components/shared/main/secondSection";
import {ThirdSection} from "@/components/shared/main/thirdSection";
import {FourSection} from "@/components/shared/main/fourSection";


export default function Home() {
    const {isAuth} = useUserStore();
  return (
      <Container>
        <FirstSection isAuthenticated={isAuth}/>
        <SecondSection/>
        <ThirdSection/>
        <FourSection/>
      </Container>
  )
}
