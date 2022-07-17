import { Body, Controller, Get, Param, Post, UnauthorizedException } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { AuthResponseDto, AuthUserDto, CreateUserDto } from "./dto";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    create(@Body() params: CreateUserDto): Promise<User> {
        return this.userService.create(params);
    }

    @Post('auth')
    async auth(@Body() params: AuthUserDto): Promise<AuthResponseDto> {
        let user = await this.userService.findOneBy({ blockchain_address: params.blockchain_address });

        if (!(user instanceof User)) {
            throw new UnauthorizedException('User/Sign not found');
        }

        //verify signature using nonce that is saved in user entity

        return {
            access_code: await this.userService.sign(user)
        };
    }
}