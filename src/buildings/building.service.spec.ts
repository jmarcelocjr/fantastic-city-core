import * as moment from 'moment';
import { Building } from 'src/entities/building.entity';
import { Rarity, Size } from 'src/entities/enums';
import { BuildingService } from './building.service';

describe('BuildingService', () => {
  let building = new Building();
  let buildingService = new BuildingService();

  beforeEach(async () => {
    building.rarity = Rarity.COMMON;
    building.size = Size.SMALL;
    building.properties = {
        reward_per_charge: 14
    };
  });

  it('recharge', () => {
    building.properties = {
      ...building.properties,
      installed: true,
      builded: true,
      builded_at: new Date()
    }

    expect(buildingService.recharge(building)).toBe(14);
    expect(building.properties.current_charge).toBe(1);
    expect(building.properties.charged_until).toBeInstanceOf(Date);
  });

  it('Throw exception recharging a recharged building', () => {
    building.properties = {
        ...building.properties,
        installed: true,
        builded: true,
        builded_at: new Date(),
        current_charge: Building.MAX_CHARGE,
        charged_until: moment().add(12, 'hours').toDate()
    }

    expect(() => {
        buildingService.recharge(building);
    }).toThrow('Already charged');

    expect(building.properties.current_charge).toBe(3);
  });

  it('Throw exception recharging a not builded building', () => {
    building.properties = {
        ...building.properties,
        installed: false,
        builded: false,
        current_charge: 0
    }

    expect(() => {
        buildingService.recharge(building);
    }).toThrow('Not Builded Yet');

    expect(building.properties.current_charge).toBe(0);
  });

  it('check', () => {
    building.properties = {
        ...building.properties,
        installed: true,
        builded: true,
        builded_at: new Date(),
        charged_until: moment().add(12, 'hours').toDate(),
        current_charge: Building.MAX_CHARGE
    }

    expect(buildingService.check(building)).toBeFalsy();
    expect(building.properties.current_charge).toBe(Building.MAX_CHARGE);
  });
});
