import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { createInMemoryUserRepository } from './testing/in-memory-user-repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createInMemoryUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('cria um usuário sem expor a senha', async () => {
    const user = await service.create({
      name: 'Ada',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    expect(user).toMatchObject({ name: 'Ada', email: 'ada@codeconnect.dev' });
    expect(user.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('faz hash da senha que confere com bcrypt', async () => {
    await service.create({
      name: 'Ada',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    const stored = await service.findByEmail('ada@codeconnect.dev');
    expect(stored).toBeDefined();
    expect(stored!.passwordHash).not.toBe('senha123');
    await expect(
      bcrypt.compare('senha123', stored!.passwordHash),
    ).resolves.toBe(true);
  });

  it('rejeita email duplicado com ConflictException', async () => {
    await service.create({
      name: 'Ada',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    await expect(
      service.create({
        name: 'Outra',
        email: 'ada@codeconnect.dev',
        password: 'outrasenha',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('busca usuário por id sem expor a senha', async () => {
    const created = await service.create({
      name: 'Ada',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    await expect(service.findById(created.id)).resolves.toMatchObject({
      name: 'Ada',
      email: 'ada@codeconnect.dev',
    });
  });

  it('lança NotFoundException para id inexistente', async () => {
    await expect(service.findById('id-inexistente')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
