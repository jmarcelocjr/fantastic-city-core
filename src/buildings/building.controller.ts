import { BadRequestException, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Building } from 'src/entities/building.entity';
import { BuildingService } from './building.service';

@Controller('buildings')
export class BuildingController {
  constructor(private building_service: BuildingService) {}

  @Get()
  async all(@Res({ passthrough: true }) res: Response): Promise<Building[]> {
    return await this.building_service.findBy({ user: res.locals.user });
  }

  @Get(':id')
  async get(@Res({ passthrough: true }) res: Response, @Param('id') id: number): Promise<Building> {
    return await this.building_service.findOneBy({ id: id, user: res.locals.user });
  }

  @Post(':id/recharge')
  async recharge(@Res({ passthrough: true }) res: Response, @Param('id') id: number) {
    const building = await this.building_service.findOneBy({ id: id, user: res.locals.user });

    if (!(building instanceof Building)) {
      throw new BadRequestException('You do not own this building');
    }

    this.building_service.recharge(building);
  }
}
