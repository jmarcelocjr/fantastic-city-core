import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { auth } from './auth.middleware';
import { BuildingModule } from './buildings/building.module';
import { LandModule } from './lands/land.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [BuildingModule, LandModule, UserModule, TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/entities/*.entity.{js,ts}'],
    synchronize: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(auth)
      .exclude(
        { path: '/users', method: RequestMethod.POST },
        '/users/auth'
      )
      .forRoutes('*');
  }
}