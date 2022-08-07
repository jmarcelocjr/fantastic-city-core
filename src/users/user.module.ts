import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { immuWalletClientOptions } from 'src/grpc/immu-wallet-client.options';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([{
      name: "IMMUWALLET_PACKAGE",
      ...immuWalletClientOptions
    }])
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
