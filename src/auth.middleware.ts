import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { User } from "./entities/user.entity";
import { UserService } from "./users/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private user_service: UserService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        let auth = req.header('Authorization');

        if (auth == null || auth == '') {
            throw new UnauthorizedException();
        }

        let user = await this.user_service.verify(auth);

        if (!(user instanceof User)) {
            throw new UnauthorizedException();
        }

        res.locals.user = user;

        next();
    }
}
