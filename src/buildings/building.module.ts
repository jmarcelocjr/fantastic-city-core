import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from 'src/entities/building.entity';
import { immuWalletClientOptions } from 'src/grpc/immu-wallet-client.options';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Building]),
    ClientsModule.register([{
      name: "IMMUWALLET_PACKAGE",
      ...immuWalletClientOptions
    }])
  ],
  exports: [BuildingService],
  controllers: [BuildingController],
  providers: [BuildingService],
})
export class BuildingModule {}
