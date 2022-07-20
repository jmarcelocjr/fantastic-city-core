import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from 'src/entities/building.entity';
import { Land } from 'src/entities/land.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class LandService {
  constructor(
    @InjectRepository(Land) private land_repository: Repository<Land>,
  ) {}

  findOneBy(where: FindOptionsWhere<Land>): Promise<Land> {
    return this.land_repository.findOneBy(where);
  }

  async install(land: Land, building: Building): Promise<boolean> {
    const size = building.size;

    if (
      land.slots[size] == null ||
      land.slots[size].spaces.length == land.slots[size].total
    ) {
      throw new BadRequestException('Not enough space to this size building');
    }

    if (land.slots[size].spaces.includes(building.id)) {
      throw new BadRequestException('Building already installed');
    }

    land.slots[size].spaces.push(building.id);
    await this.land_repository.save(land);

    return true;
  }

  async remove(land: Land, building: Building): Promise<boolean> {
    const size = building.size;

    const key = land.slots[size]?.spaces.indexOf(building.id);
    if (typeof key == 'undefined' || key == -1) {
      throw new BadRequestException('Building not installed in this land');
    }

    land.slots[size].spaces.splice(key, 1);
    await this.land_repository.save(land);

    return true;
  }
}
