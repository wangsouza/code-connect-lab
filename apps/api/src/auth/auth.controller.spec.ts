import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { createInMemoryUserRepository } from '../users/testing/in-memory-user-repository';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtPayload } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createInMemoryUserRepository(),
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('signed.jwt.token'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);

    await usersService.create({
      name: 'Ada',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });
  });

  it('faz login e retorna access_token', async () => {
    const result = await controller.login({
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });
    expect(result).toEqual({ access_token: 'signed.jwt.token' });
  });

  it('retorna os dados do usuário logado em /me', async () => {
    const user = await usersService.create({
      name: 'Beto',
      email: 'beto@codeconnect.dev',
      password: 'senha456',
    });

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const request = { user: payload } as unknown as Parameters<
      AuthController['me']
    >[0];

    await expect(controller.me(request)).resolves.toMatchObject({
      name: 'Beto',
      email: 'beto@codeconnect.dev',
    });
  });
});
