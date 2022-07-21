import 'dotenv/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Building } from 'src/entities/building.entity';
import { Rarity, Size } from 'src/entities/enums';
import { BuildingService } from './building.service';
import { Land } from 'src/entities/land.entity';

describe('BuildingService', () => {
  let building: Building;
  let building_service: BuildingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Building]),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: 'test',
          entities: [__dirname + '/../entities/*.entity.{js,ts}'],
          synchronize: true,
        }),
      ],
      providers: [BuildingService],
    }).compile();

    building_service = await moduleRef.resolve(BuildingService);

    building = new Building();
    building.nft_id = Math.random();
    building.rarity = Rarity.COMMON;
    building.size = Size.SMALL;
    building.properties = {
      reward_per_charge: 14,
    };
  });

  it('recharge', async () => {
    building.properties = {
      ...building.properties,
      installed: true,
      builded: true,
      builded_at: new Date(),
    };

    expect(await building_service.recharge(building)).toBe(14);
    expect(building.properties.current_charge).toBe(1);
    expect(building.properties.charged_until).toBeInstanceOf(Date);
  });

  it('Throw exception recharging a recharged building', async () => {
    building.properties = {
      ...building.properties,
      installed: true,
      builded: true,
      builded_at: new Date(),
      current_charge: Building.MAX_CHARGE,
      charged_until: moment().add(12, 'hours').toDate(),
    };

    await expect(building_service.recharge(building)).rejects.toThrow('Already charged');

    expect(building.properties.current_charge).toBe(3);
  });

  it('Throw exception recharging a not builded building', async () => {
    building.properties = {
      ...building.properties,
      installed: false,
      builded: false,
      current_charge: 0,
    };

    await expect(building_service.recharge(building)).rejects.toThrow('Not Builded Yet');

    expect(building.properties.current_charge).toBe(0);
  });

  it('check', () => {
    building.properties = {
      ...building.properties,
      installed: true,
      builded: true,
      builded_at: new Date(),
      charged_until: moment().add(12, 'hours').toDate(),
      current_charge: Building.MAX_CHARGE,
    };

    expect(building_service.check(building)).toBeFalsy();
    expect(building.properties.current_charge).toBe(Building.MAX_CHARGE);
  });

  it('install', async () => {
    building.properties = {
      ...building.properties,
      installed: false,
    };

    expect(await building_service.installed(building, new Land())).toBeTruthy();
    expect(building.properties.installed).toBeTruthy();
    expect(building.properties.builded).toBeFalsy();
    expect(building.properties.builded_at).toBeNull();
    expect(building.properties.current_charge).toBe(0);
    expect(building.properties.charged_until).toBeNull();
  });

  it('throw exception when installing a installed building', async () => {
    building.properties = {
      ...building.properties,
      installed: true,
    };

    await expect(
      building_service.installed(building, new Land()),
    ).rejects.toThrow('Building already installed');
  });

  it('remove', async () => {
    building.properties = {
      ...building.properties,
      installed: true,
    };

    expect(await building_service.removed(building)).toBeTruthy();
    expect(building.properties.installed).toBeFalsy();
    expect(building.properties.builded).toBeFalsy();
    expect(building.properties.builded_at).toBeNull();
    expect(building.land).toBeNull();
  });

  it('throw exception when removing a building not installed', async () => {
    building.properties = {
      ...building.properties,
      installed: false,
    };

    await expect(building_service.removed(building)).rejects.toThrow();
  });
});
