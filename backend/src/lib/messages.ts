// Shared bilingual (Japanese / English) fallback text for user-facing errors.
// Never forward raw Prisma/Zod internals to the client; use these instead.
export const GENERIC_SERVER_ERROR =
  "エラーが発生しました。しばらくしてから再度お試しください。 / Something went wrong on our end. Please try again.";
export const GENERIC_VALIDATION_ERROR =
  "入力内容をご確認ください。 / Please check this field and try again.";
