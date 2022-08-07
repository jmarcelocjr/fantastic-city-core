import { BadRequestException, Controller, Get, Inject, Param, Post, Res } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MessageResponseDTO } from 'src/dto/common.dto';
import { ImmuWalletService } from 'src/dto/immu-wallet.dto';
import { Building } from 'src/entities/building.entity';
import { BuildingService } from './building.service';

@Controller('buildings')
export class BuildingController {
  private immu_wallet_service: ImmuWalletService;

  constructor(
    private building_service: BuildingService,
    @Inject('IMMUWALLET_PACKAGE') private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.immu_wallet_service = this.client.getService<ImmuWalletService>('ImmuWallet');
  }

  @Get()
  async all(@Res({ passthrough: true }) res: Response): Promise<Building[]> {
    return await this.building_service.findBy({ user: res.locals.user });
  }

  @Get(':id')
  async get(@Res({ passthrough: true }) res: Response, @Param('id') id: number): Promise<Building> {
    return await this.building_service.findOneBy({ id: id, user: res.locals.user });
  }

  @Post(':id/recharge')
  async recharge(@Res({ passthrough: true }) res: Response, @Param('id') id: number): Promise<MessageResponseDTO> {
    const building = await this.building_service.findOneBy({ id: id, user: res.locals.user });

    if (!(building instanceof Building)) {
      throw new BadRequestException('You do not own this building');
    }

    const reward = await this.building_service.recharge(building);

    const observable_response = this.immu_wallet_service.transfer({
      from: {
        user_id: 0,
        token: "doullars",
        balance: 0
      },
      to: {
        user_id: res.locals.user.id,
        token: "doullars",
        balance: 0
      },
      value: reward,
      description: `Reward of recharging building #${building.id}`
    });

    const response = await firstValueFrom(observable_response);
    if (!response.success) {
      console.log(`Error transfer wallet: ${response.message}`);
    }

    return {
      success: response.success,
      message: response.success ? "Recharged successfully" : "Something went wrong"
    };
  }
}
