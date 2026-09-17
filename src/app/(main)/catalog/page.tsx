'use client'

import {useSearchParams} from "next/navigation";
import {Container} from "@/components/ui/container";
import {Catalog} from "@/components/shared/productCatalog/catalog";
import {ProductSearchFilter} from "@/components/shared/productCatalog/productSearchFilter";

export default function Page() {
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get("search") || "";
    const currentSubCategoryId = searchParams.get("subCategoryId") || undefined;

    return (
        <>
            <Container className="mt-3.75">
                <ProductSearchFilter />
            </Container>
            <Container className="">
                <Catalog
                    currentSearch={currentSearch}
                    currentSubCategoryId={currentSubCategoryId}
                />
            </Container>
        </>
    );
}