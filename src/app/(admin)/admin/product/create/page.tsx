import {Container} from "@/components/ui/container";
import {ProductForm} from "@/components/shared/admin/product/productForm";

export default function Page () {
    return (
        <Container className="bg-[#2C2C31] rounded-[20px] px-5 py-7.5 mt-3.75">
            <div>
                <h2 className={'font-russo text-2xl'}>Создание товара</h2>
                <p className={'text-white/55 text-sm'}>Заполните ве поля и не забудьте сохранить</p>
                <ProductForm className={'mt-4.75'}/>
            </div>
        </Container>
    )
}