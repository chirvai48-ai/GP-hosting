import { Request,Response, NextFunction } from "express"
import { Schema, ZodError } from "zod"

// Zod's default flatten() messages are raw/technical English (e.g. "Invalid
// input: expected string, received undefined"). Replace them with one
// friendly bilingual message per field instead of forwarding zod internals.
const FRIENDLY_MESSAGE =
    "入力内容をご確認ください。 / Please check this field and try again.";

const friendlyFlatten = (error: ZodError) => {
    const flat = error.flatten();
    const fieldErrors: Record<string, string[]> = {};
    for (const key of Object.keys(flat.fieldErrors)) {
        fieldErrors[key] = [FRIENDLY_MESSAGE];
    }
    return {
        formErrors: flat.formErrors.length ? [FRIENDLY_MESSAGE] : [],
        fieldErrors,
    };
};

export const validateCreate = (schema:Schema) =>
(req:Request,res:Response,next:NextFunction) => {
    const validatedData = schema.safeParse(req.body);
    if(!validatedData.success){
        res.status(400).json({error: friendlyFlatten(validatedData.error)})
        return;
    }
    req.body = validatedData.data
    next()

}
export const validateUpdate = (schema:Schema) =>
(req:Request,res:Response,next:NextFunction) => {
    const validatedData = schema.safeParse(req.body);
    if(!validatedData.success){
        res.status(400).json({error: friendlyFlatten(validatedData.error)})
        return;
    }
    req.body = validatedData.data
    next()

}