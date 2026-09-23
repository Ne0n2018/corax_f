export function SelfPickup () {
    return (
        <div className={'p-7.5 bg-[#2C2C31] rounded-[20px] flex flex-col text-white h-full gap-5'}>
            <h2 className={'font-russo text-2xl font-medium'}>Самовывоз</h2>
            <div>
                <h3 className={'text-xl font-semibold'}>1 . Оформите заказ на сайте</h3>
                <p className={'text-sm font-medium'}>Добавьте нужные товары в корзину и выберите способ получения самовывоз при оформлении.</p>
            </div>
            <div>
                <h3 className={'text-xl font-semibold'}>2 . Ожидайте доставку заказа</h3>
                <p className={'text-sm font-medium'}>Заказ доставляется по адресу выдачи в течение минимум 3 дней с момента подтверждения. Срок может немного увеличиться в зависимости от загруженности и наличия товаров.</p>
            </div>
            <div>
                <h3 className={'text-xl font-semibold'}>3 . Получите уведомление</h3>
                <p className={'text-sm font-medium'}>Когда заказ будет доставлен и готов к выдаче, вы получите уведомление на почту</p>
            </div>
            <div>
                <h3 className={'text-xl font-semibold'}>4 .  Приезжайте за заказом</h3>
                <p className={'text-sm font-medium'}>По адресу выдачи заказ можно забрать в соответствии с установленным графиком работы.</p>
            </div>
            <div>
                <h3 className={'text-xl font-semibold'}>5 . Предоставьте номер заказа </h3>
                <p className={'text-sm font-medium'}>Предоставьте сотруднику номер вашего заказа. если заказ не был оплачен онлайн, оплатить его можно при получении. </p>
            </div>
            <div>
                <h3 className={'text-xl font-semibold'}>6 . Получите ваш заказ</h3>
                <p className={'text-sm font-medium'}>Заберите свой заказ в удобное время и возвращайтесь к нам снова за новыми выгодными покупками!</p>
            </div>
        </div>
    )
}