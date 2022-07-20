import 'dotenv/config'
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let user: User;
  let user_service: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: 'test',
          entities: [__dirname + '/../entities/*.entity.{js,ts}'],
          synchronize: true,
        })
      ],
      providers: [UserService],
    }).compile();

    user_service = await moduleRef.resolve(UserService);

    user = new User();
    user.blockchain_address = 'abcdef1234567890';
  });

  it('create', async () => {
    let createdUser = await user_service.create(user);

    expect(createdUser.id).toBeDefined();
    expect(createdUser.nonce).toBeGreaterThan(0);
  });

  it('sign', async () => {
    let jwt = await user_service.sign(user);

    expect(jwt).not.toBe('');
  });

  it('verify', async () => {
    let createdUser = await user_service.create(user);
    let jwt = await user_service.sign(createdUser);

    let verifiedUser = await user_service.verify(jwt);

    expect(verifiedUser.id).toBe(createdUser.id);
    expect(verifiedUser.blockchain_address).toBe(createdUser.blockchain_address);
  });
});
