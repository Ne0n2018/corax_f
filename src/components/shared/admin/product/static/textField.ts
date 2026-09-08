// Вне компонента (на уровне файла)
export const TEXT_FIELDS = [
    { name: "name", label: "Название товара", placeholder: "Введите название товара..." },
    { name: "shortDescription", label: "Краткое описание товара", placeholder: "Введите краткое описание товара..." },
    { name: "description", label: "Описание товара", placeholder: "Введите описание товара..." },
    { name: "structure", label: "Состав товара", placeholder: "Введите состав товара..." },
    { name: "advantages", label: "Преимущество товара", placeholder: "Введите преимущества товара..." },
    { name: "formRelease", label: "Форма выпуска", placeholder: "Введите форму выпуска..." },
] as const;