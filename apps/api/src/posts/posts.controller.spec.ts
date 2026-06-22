import { Test, TestingModule } from '@nestjs/testing';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  const findAll = jest.fn();
  const findOneBySlug = jest.fn();
  const like = jest.fn();
  const unlike = jest.fn();
  const createComment = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: { findAll, findOneBySlug, like, unlike, createComment },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(OptionalAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('lista posts como visitante (sem userId)', async () => {
    findAll.mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
    });

    await controller.findAll({ page: 1, limit: 12 }, {} as Request);

    expect(findAll).toHaveBeenCalledWith({ page: 1, limit: 12 }, undefined);
  });

  it('lista posts com userId quando autenticado', async () => {
    findAll.mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
    });
    const request = { user: { sub: 'user-1', email: 'a@b.dev' } } as never;

    await controller.findAll({}, request);

    expect(findAll).toHaveBeenCalledWith({}, 'user-1');
  });

  it('curtir usa o id do usuário autenticado', async () => {
    const request = { user: { sub: 'user-1', email: 'a@b.dev' } } as never;

    await controller.like('post-1', request);

    expect(like).toHaveBeenCalledWith('post-1', 'user-1');
  });

  it('cria comentário repassando o dto', async () => {
    const request = { user: { sub: 'user-1', email: 'a@b.dev' } } as never;

    await controller.createComment('post-1', { content: 'Top!' }, request);

    expect(createComment).toHaveBeenCalledWith('post-1', 'user-1', {
      content: 'Top!',
    });
  });
});
