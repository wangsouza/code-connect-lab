import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { createInMemoryUserRepository } from '../users/testing/in-memory-user-repository';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    await usersService.create({
      name: 'Ada',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });
  });

  it('retorna access_token para credenciais válidas', async () => {
    const result = await service.signIn('ada@codeconnect.dev', 'senha123');
    expect(result).toEqual({ access_token: 'signed.jwt.token' });
  });

  it('lança UnauthorizedException para senha incorreta', async () => {
    await expect(
      service.signIn('ada@codeconnect.dev', 'senhaErrada'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('lança UnauthorizedException para email inexistente', async () => {
    await expect(
      service.signIn('ninguem@codeconnect.dev', 'senha123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
