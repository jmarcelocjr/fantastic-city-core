import { Controller, Get, Param } from '@nestjs/common';
import { Building } from 'src/entities/building.entity';
import { BuildingService } from './building.service';

@Controller('buildings')
export class BuildingController {
  constructor(private building_service: BuildingService) {}

  @Get()
  all(): Building[] {
    return [];
  }

  @Get(':id')
  async get(@Param('id') id): Promise<Building> {
    return await this.building_service.findOneBy({ id: id });
  }
}
