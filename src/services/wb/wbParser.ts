import { z } from "zod";

/**
 * Zod-схема для парсинга и валидации числа WB.
 * 1. Обрабатывает пустые значения, "-" и null/undefined.
 * 2. Заменяет запятые на точки для правильного парсинга.
 * 3. Преобразует строку в число.
 */
export const wbNumberSchema = z
    .string()
    .transform(val => val.trim())
    .refine(val => val !== "" && val !== "-", {
        message: "Value must not be empty or '-'",
    })
    .transform(val => val.replace(",", "."))
    .pipe(z.coerce.number())
    .refine(num => Number.isFinite(num), {
        message: "Parsed value is not a finite number",
    });

/**
 * Оптимизированная функция парсинга с использованием Zod.
 * Использует safeParse для возврата null в случае ошибки валидации,
 * чтобы сохранить исходное поведение.
 */
export function parseWbNumber(value: string | null | undefined): number | null {

    const schemaWithNull = z.union([
        z.literal(null),
        z.literal(undefined),
        wbNumberSchema,
    ]);

    const result = schemaWithNull.safeParse(value);

    if (result.success && typeof result.data === 'number') {
        return result.data;
    }

    return null;
}