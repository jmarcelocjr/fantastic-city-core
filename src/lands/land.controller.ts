import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { BuildingService } from 'src/buildings/building.service';
import { MessageResponseDTO } from 'src/common/dto';
import { Building } from 'src/entities/building.entity';
import { Land } from 'src/entities/land.entity';
import { LandService } from './land.service';

@Controller('lands')
export class LandController {
  constructor(
    private land_service: LandService,
    private building_service: BuildingService,
  ) {}

  @Get()
  getAll(): Promise<Land[]> {
    return null;
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<Land> {
    return await this.land_service.findOneBy({ id: id });
  }

  @Post(':id/install/:building_id')
  async install(
    @Res({ passthrough: true }) res,
    @Param('id') land_id: number,
    @Param('building_id') building_id: number,
  ): Promise<MessageResponseDTO> {
    const land = await this.land_service.findOneBy({
      id: land_id,
      user: res.locals.user,
    });

    if (!(land instanceof Land)) {
      throw new BadRequestException('Land not found');
    }

    const building = await this.building_service.findOneBy({
      id: building_id,
      user: res.locals.user,
    });

    if (!(building instanceof Building)) {
      throw new BadRequestException('Building not found');
    }

    this.land_service.install(land, building);
    this.building_service.installed(building, land);

    return {
      success: true,
      message: 'Building installed successfully',
    };
  }

  @Delete(':id/remove/:building_id')
  async remove(
    @Res({ passthrough: true }) res,
    @Param('id') land_id: number,
    @Param('building_id') building_id: number,
  ): Promise<MessageResponseDTO> {
    const land = await this.land_service.findOneBy({
      id: land_id,
      user: res.locals.user,
    });

    if (!(land instanceof Land)) {
      throw new BadRequestException('Land not found');
    }

    const building = await this.building_service.findOneBy({
      id: building_id,
      user: res.locals.user,
    });

    if (!(building instanceof Building)) {
      throw new BadRequestException('Building not found');
    }

    this.land_service.remove(land, building);
    this.building_service.removed(building);

    return {
      success: true,
      message: 'Building removed successfully',
    };
  }
}
