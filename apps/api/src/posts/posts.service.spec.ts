import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { PostLike } from './entities/post-like.entity';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepo: { findOne: jest.Mock };
  let commentsRepo: {
    findOne: jest.Mock;
    findOneOrFail: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let likesRepo: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  const author = {
    id: 'user-1',
    name: 'Júlio',
    email: 'julio@codeconnect.dev',
  };

  beforeEach(async () => {
    postsRepo = { findOne: jest.fn() };
    commentsRepo = {
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      create: jest.fn((data: object) => data),
      save: jest.fn((data: object) =>
        Promise.resolve({ id: 'comment-new', ...data }),
      ),
    };
    likesRepo = {
      findOne: jest.fn(),
      create: jest.fn((data: object) => data),
      save: jest.fn((data: object) => Promise.resolve(data)),
      delete: jest.fn(() => Promise.resolve({ affected: 1 })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: postsRepo },
        { provide: getRepositoryToken(Comment), useValue: commentsRepo },
        { provide: getRepositoryToken(PostLike), useValue: likesRepo },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  describe('like', () => {
    it('lança NotFound quando o post não existe', async () => {
      postsRepo.findOne.mockResolvedValue(null);
      await expect(service.like('post-x', 'user-1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('é idempotente quando já existe curtida', async () => {
      postsRepo.findOne.mockResolvedValue({ id: 'post-1' });
      likesRepo.findOne.mockResolvedValue({ id: 'like-1' });

      await service.like('post-1', 'user-1');

      expect(likesRepo.save).not.toHaveBeenCalled();
    });

    it('cria curtida quando ainda não existe', async () => {
      postsRepo.findOne.mockResolvedValue({ id: 'post-1' });
      likesRepo.findOne.mockResolvedValue(null);

      await service.like('post-1', 'user-1');

      expect(likesRepo.save).toHaveBeenCalled();
    });
  });

  describe('createComment', () => {
    it('lança NotFound quando o post não existe', async () => {
      postsRepo.findOne.mockResolvedValue(null);
      await expect(
        service.createComment('post-x', 'user-1', { content: 'oi' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('cria comentário raiz e retorna o autor', async () => {
      postsRepo.findOne.mockResolvedValue({ id: 'post-1' });
      commentsRepo.findOneOrFail.mockResolvedValue({
        id: 'comment-new',
        content: 'Top!',
        author,
        createdAt: new Date(),
      });

      const result = await service.createComment('post-1', 'user-1', {
        content: 'Top!',
      });

      expect(result.author.username).toBe('@julio');
      expect(result.replies).toEqual([]);
    });

    it('impede responder a uma resposta (2º nível)', async () => {
      postsRepo.findOne.mockResolvedValue({ id: 'post-1' });
      commentsRepo.findOne.mockResolvedValue({
        id: 'reply-1',
        post: { id: 'post-1' },
        parent: { id: 'root-1' },
      });

      await expect(
        service.createComment('post-1', 'user-1', {
          content: 'resposta',
          parentId: 'reply-1',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('lança NotFound quando o comentário pai é de outro post', async () => {
      postsRepo.findOne.mockResolvedValue({ id: 'post-1' });
      commentsRepo.findOne.mockResolvedValue({
        id: 'root-1',
        post: { id: 'outro-post' },
        parent: null,
      });

      await expect(
        service.createComment('post-1', 'user-1', {
          content: 'resposta',
          parentId: 'root-1',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
