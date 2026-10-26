import type {Metadata} from "next";
import { Container } from "@/components/ui/container";
import { AboutUsSection } from "@/components/shared/about/AboutUsSection";
import { AboutBrandsSection } from "@/components/shared/about/AboutBrandsSection";

export const metadata: Metadata = {
    title: "О нас — Corax",
};

export default function Page() {
    return (
        <Container className="mt-3.75">
            <AboutUsSection />                                                                                       
            <AboutBrandsSection />
        </Container>
    )                                  
}                                                                                                            