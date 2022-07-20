import 'dotenv/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from 'src/entities/building.entity';
import { Rarity, Size } from 'src/entities/enums';
import { Land } from 'src/entities/land.entity';
import { LandService } from './land.service';

describe('LandService', () => {
  let land: Land;
  let building: Building;
  let land_service: LandService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Land]),
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
      providers: [LandService],
    }).compile();

    land_service = await moduleRef.resolve(LandService);

    land = new Land();
    land.nft_id = Math.random();
    land.rarity = Rarity.EPIC;
    land.size = Size.LARGE;
    land.type = 'free';
    land.properties = {};

    building = new Building();
  });

  it('install a small building', async () => {
    land.slots = {
      small: {
        spaces: [],
        total: 1,
      },
    };

    building.size = Size.SMALL;

    expect(await land_service.install(land, building)).toBeTruthy();
  });

  it('throw exception when installing a small building in a land with full space', async () => {
    land.slots = {
      small: {
        spaces: [1],
        total: 1,
      },
    };

    building.size = Size.SMALL;

    await expect(land_service.install(land, building)).rejects.toThrow();
  });

  it('throw exception when installing a small building that are already installed on this land', async () => {
    land.slots = {
      small: {
        spaces: [1],
        total: 1,
      },
    };

    building.id = 1;
    building.size = Size.SMALL;

    await expect(land_service.install(land, building)).rejects.toThrow();
  });

  it('remove a small building', async () => {
    land.slots = {
      small: {
        spaces: [1],
        total: 1,
      },
    };

    building.id = 1;
    building.size = Size.SMALL;

    expect(await land_service.remove(land, building)).toBeTruthy();
  });

  it('throw exception when removing a small building in a land that are not installed', async () => {
    land.slots = {
      small: {
        spaces: [1],
        total: 1,
      },
    };

    building.id = 2;
    building.size = Size.SMALL;

    await expect(land_service.remove(land, building)).rejects.toThrow();
  });
});
