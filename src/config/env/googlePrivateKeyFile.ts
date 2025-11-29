import { z } from "zod";

/**
 * Zod-схема для ключа сервисного аккаунта Google,
 * который хранится в переменной окружения как строка JSON.
 */
export const GoogleServiceAccountKeySchema = z.object({
    type: z.literal("service_account"),
    project_id: z.string().min(1, "project_id не может быть пустым."),
    private_key_id: z.string().min(1, "private_key_id не может быть пустым."),
    private_key: z.string().startsWith("-----BEGIN PRIVATE KEY-----", {
        message: "private_key должен начинаться с -----BEGIN PRIVATE KEY-----",
    }),
    client_email: z.string().email("client_email должен быть действительным email."),
    client_id: z.string().min(1, "client_id не может быть пустым."),
    auth_uri: z.string().url("auth_uri должен быть действительным URL."),
    token_uri: z.string().url("token_uri должен быть действительным URL."),
    auth_provider_x509_cert_url: z.string().url("auth_provider_x509_cert_url должен быть действительным URL."),
    client_x509_cert_url: z.string().url("client_x509_cert_url должен быть действительным URL."),

    universe_domain: z.string().min(1, "universe_domain не может быть пустым."),
});


/**
 * Zod-схема для парсинга переменной окружения (строка JSON).
 * Использует .transform для парсинга строки в объект перед валидацией.
 */
export const GoogleKeyEnvVarSchema = z
    .string()
    .min(1, "Переменная окружения с ключом не может быть пустой.")
    .transform((str, ctx) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Строка не является валидным JSON.",
            });
            return z.NEVER;
        }
    })
    .pipe(GoogleServiceAccountKeySchema);
