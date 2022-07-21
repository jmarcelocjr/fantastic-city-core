import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Building } from 'src/entities/building.entity';
import { Land } from 'src/entities/land.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private building_repository: Repository<Building>,
  ) {}

  findBy(where: FindOptionsWhere<Building>): Promise<Building[]> {
    return this.building_repository.findBy(where);
  }

  findOneBy(where: FindOptionsWhere<Building>): Promise<Building> {
    return this.building_repository.findOneBy(where);
  }

  async installed(building: Building, land: Land): Promise<boolean> {
    if (building.properties.installed) {
      throw new BadRequestException('Building already installed');
    }

    building.properties.installed = true;
    building.properties.builded = false;
    building.properties.builded_at = null;
    building.properties.current_charge = 0;
    building.properties.charged_until = null;

    building.land = land;

    await this.building_repository.save(building);

    return true;
  }

  async removed(building: Building): Promise<boolean> {
    if (!building.properties.installed) {
      throw new BadRequestException('Building not installed');
    }

    building.properties.installed = false;
    building.properties.builded = false;
    building.properties.builded_at = null;
    building.land = null;

    await this.building_repository.save(building);

    return true;
  }

  async recharge(building: Building): Promise<number> {
    if (!building.properties.builded) {
      throw new BadRequestException('Not Builded Yet');
    }

    this.check(building);

    if (building.properties.current_charge == Building.MAX_CHARGE) {
      throw new BadRequestException('Already charged');
    }

    const time = moment(building.properties.builded_at ?? 'now');
    time.add(Building.HOURS_PER_CHARGE, 'hours');

    const current_charge = Math.ceil(
      (time.toDate().getTime() - new Date().getTime()) /
        1000 /
        60 /
        60 /
        Building.HOURS_PER_CHARGE,
    );

    building.properties = {
      ...building.properties,
      charged_until: time.toDate(),
      current_charge: current_charge,
    };

    await this.building_repository.save(building);

    return building.properties.reward_per_charge;
  }

  check(building: Building): boolean {
    return this.checkEnergy(building);
  }

  private checkEnergy(building: Building): boolean {
    if ((building.properties.current_charge ?? 0) == 0) {
      return false;
    }

    const diff = building.properties.charged_until.getTime() - new Date().getTime();

    let current_charge = Math.ceil(
      diff / 1000 / 60 / 60 / Building.HOURS_PER_CHARGE,
    );
    current_charge = Math.max(current_charge, 0);

    const changed = current_charge != building.properties.current_charge;
    building.properties.current_charge = current_charge;

    if (current_charge == 0) {
      building.properties.charged_until = null;
    }

    return changed;
  }
}
