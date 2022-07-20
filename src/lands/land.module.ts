import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingModule } from 'src/buildings/building.module';
import { Land } from 'src/entities/land.entity';
import { LandController } from './land.controller';
import { LandService } from './land.service';

@Module({
  imports: [BuildingModule, TypeOrmModule.forFeature([Land])],
  controllers: [LandController],
  providers: [LandService],
})
export class LandModule {}
