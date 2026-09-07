import { Request,Response, NextFunction } from "express"
import { Schema, ZodError } from "zod"
import { GENERIC_VALIDATION_ERROR } from "../lib/messages"

// Zod's default flatten() messages are raw/technical English (e.g. "Invalid
// input: expected string, received undefined"). Replace them with one
// friendly bilingual message per field instead of forwarding zod internals.
const friendlyFlatten = (error: ZodError) => {
    const flat = error.flatten();
    const fieldErrors: Record<string, string[]> = {};
    for (const key of Object.keys(flat.fieldErrors)) {
        fieldErrors[key] = [GENERIC_VALIDATION_ERROR];
    }
    return {
        formErrors: flat.formErrors.length ? [GENERIC_VALIDATION_ERROR] : [],
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