import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Building } from 'src/entities/building.entity';
import { Rarity, Size } from 'src/entities/enums';
import { BuildingModule } from 'src/buildings/building.module';

describe('Buildingdocker (e2e)', () => {
});
