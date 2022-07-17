import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createSecretKey } from "crypto";
import { jwtVerify, SignJWT } from "jose";
import { User } from "src/entities/user.entity";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    findOneBy(where: FindOptionsWhere<User>): Promise<User> {
        return this.userRepository.findOneBy(where);
    }

    async create(user: User): Promise<User> {
        const _user = await this.findOneBy({ blockchain_address: user.blockchain_address });

        if (_user instanceof User) {
            return _user;
        }

        user.nonce = Math.floor(Math.random() * 10000);
        return this.userRepository.save(user);
    }

    sign(user: User): Promise<string> {
        return new SignJWT({ 
            blockchain_address: user.blockchain_address 
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('fantastic-city')
        .setExpirationTime('6h')
        .sign(createSecretKey(process.env.SECRET_KEY, 'utf-8'));
    }

    async verify(jwt: string): Promise<User> {
        const { payload, protectedHeader } = await jwtVerify(jwt, createSecretKey(process.env.SECRET_KEY, 'utf-8'), {
            issuer: 'fantastic-city'
        });

        return this.findOneBy({ blockchain_address: payload.blockchain_address.toString() });
    }
}