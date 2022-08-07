import { Body, Controller, Get, Inject, Param, Post, Res, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ImmuWalletService, User as ImmuWalletUser } from 'src/dto/immu-wallet.dto';
import { User } from 'src/entities/user.entity';
import { AuthResponseDto, AuthUserDto, CreateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  private immu_wallet_service: ImmuWalletService;

  constructor(
    private user_service: UserService,
    @Inject('IMMUWALLET_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.immu_wallet_service = this.client.getService<ImmuWalletService>('ImmuWallet');
  }

  @Get('')
  async get(@Res({ passthrough: true }) res: Response): Promise<User> {
    const user = await this.user_service.findOneBy({ id: res.locals.user.id });

    const wallets = this.immu_wallet_service.getWallets(user as ImmuWalletUser);

    user.wallets = (await firstValueFrom(wallets)).wallets;

    return user;
  }

  @Post()
  async create(@Body() params: CreateUserDto): Promise<User> {
    const user = await this.user_service.create(params);
    const observable_response = this.immu_wallet_service.registerWallet({
      user_id: user.id,
      token: "doullars",
      balance: 0
    });

    const response = await firstValueFrom(observable_response);
    if (!response.success) {
      console.log(`Error creating wallet: ${response.message}`);
    }

    return user;
  }

  @Post('auth')
  async auth(@Body() params: AuthUserDto): Promise<AuthResponseDto> {
    const user = await this.user_service.findOneBy({
      blockchain_address: params.blockchain_address,
    });

    if (!(user instanceof User)) {
      throw new UnauthorizedException('User/Sign not found');
    }

    //verify signature using nonce that is saved in user entity

    return {
      access_code: await this.user_service.sign(user),
    };
  }
}
