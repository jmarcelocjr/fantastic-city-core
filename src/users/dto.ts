import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    blockchain_address: string;
}

export class AuthUserDto {
    @IsNotEmpty()
    blockchain_address: string;

    @IsNotEmpty()
    signature: string;
}

export class AuthResponseDto {
    access_code: string;
}
