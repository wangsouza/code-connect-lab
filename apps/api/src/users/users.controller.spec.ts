import { Test, TestingModule } from '@nestjs/testing';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: { create: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('cadastra um usuário e retorna sem a senha', async () => {
    const mockResponse: UserResponseDto = {
      id: '9a72b703-896e-4043-be66-59f0536fab97',
      name: 'Ada',
      email: 'ada@codeconnect.dev',
    };
    usersService.create.mockResolvedValue(mockResponse);

    const response = await controller.create({
      name: 'Ada',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    expect(response).toEqual(mockResponse);
    expect(response).not.toHaveProperty('passwordHash');
    // eslint-disable-next-line @typescript-eslint/unbound-method -- referência a mock do jest
    expect(usersService.create).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });
  });
});
