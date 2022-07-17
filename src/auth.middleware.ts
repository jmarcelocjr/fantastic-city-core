import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
    let auth = req.header('Authorization');

    if (auth == null || auth == '') {
        throw new UnauthorizedException();
    }

    next();
}