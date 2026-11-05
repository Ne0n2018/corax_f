// Вне компонента (на уровне файла)
export const TEXT_FIELDS = [
    { name: "name", label: "Название товара", placeholder: "Введите название товара...", textArea: false },
    { name: "shortDescription", label: "Краткое описание товара", placeholder: "Введите краткое описание товара...", textArea: true},
    { name: "description", label: "Описание товара", placeholder: "Введите описание товара...", textArea: true },
    { name: "structure", label: "Состав товара", placeholder: "Введите состав товара...", textArea: false },
    { name: "advantages", label: "Преимущество товара", placeholder: "Введите преимущества товара...", textArea: false },
    { name: "formRelease", label: "Форма выпуска", placeholder: "Введите форму выпуска...", textArea: false },
] as const;