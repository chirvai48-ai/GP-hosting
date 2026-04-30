import { Request,Response, NextFunction } from "express"
import { Schema } from "zod"

export const validateCreate = (schema:Schema) => 
(req:Request,res:Response,next:NextFunction) => {
    const validatedData = schema.safeParse(req.body);
    if(!validatedData.success){
        res.status(400).json({error:validatedData.error.flatten()})
        return;
    }
    req.body = validatedData.data
    next()
    
}
export const validateUpdate = (schema:Schema) => 
(req:Request,res:Response,next:NextFunction) => {
    const validatedData = schema.safeParse(req.body);
    if(!validatedData.success){
        res.status(400).json({error:validatedData.error.flatten()})
        return;
    }
    req.body = validatedData.data
    next()
    
}