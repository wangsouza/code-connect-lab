import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedPostsDto } from './dto/paginated-posts.dto';
import { PostAuthorDto } from './dto/post-author.dto';
import { PostDetailDto } from './dto/post-detail.dto';
import { PostSummaryDto } from './dto/post-summary.dto';
import { Comment } from './entities/comment.entity';
import { PostLike } from './entities/post-like.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(PostLike)
    private readonly likesRepository: Repository<PostLike>,
  ) {}

  async findAll(
    query: FindPostsQueryDto,
    userId?: string,
  ): Promise<PaginatedPostsDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.search) {
      qb.where("post.search_vector @@ plainto_tsquery('portuguese', :q)", {
        q: query.search,
      });
    }

    const [posts, total] = await qb.getManyAndCount();
    const ids = posts.map((post) => post.id);
    const [likeCounts, commentCounts, likedIds] = await Promise.all([
      this.countByPost(this.likesRepository, ids),
      this.countByPost(this.commentsRepository, ids),
      this.likedPostIds(ids, userId),
    ]);

    return {
      data: posts.map((post) =>
        this.toSummary(post, {
          likesCount: likeCounts.get(post.id) ?? 0,
          commentsCount: commentCounts.get(post.id) ?? 0,
          likedByMe: likedIds.has(post.id),
        }),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOneBySlug(slug: string, userId?: string): Promise<PostDetailDto> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.slug = :slug', { slug })
      .getOne();

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    const [likeCounts, likedIds, comments] = await Promise.all([
      this.countByPost(this.likesRepository, [post.id]),
      this.likedPostIds([post.id], userId),
      this.commentsRepository.find({
        where: { post: { id: post.id } },
        order: { createdAt: 'ASC' },
      }),
    ]);

    return {
      ...this.toSummary(post, {
        likesCount: likeCounts.get(post.id) ?? 0,
        commentsCount: comments.length,
        likedByMe: likedIds.has(post.id),
      }),
      content: post.content,
      comments: this.buildCommentTree(comments),
    };
  }

  async like(postId: string, userId: string): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    const existing = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    if (existing) {
      return;
    }

    await this.likesRepository.save(
      this.likesRepository.create({
        post: { id: postId } as Post,
        user: { id: userId } as User,
      }),
    );
  }

  async unlike(postId: string, userId: string): Promise<void> {
    await this.likesRepository.delete({
      post: { id: postId },
      user: { id: userId },
    });
  }

  async createComment(
    postId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<CommentDto> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    let parent: Comment | null = null;
    if (dto.parentId) {
      parent = await this.commentsRepository.findOne({
        where: { id: dto.parentId },
        relations: { post: true, parent: true },
      });
      if (!parent || parent.post.id !== postId) {
        throw new NotFoundException('Comentário pai não encontrado');
      }
      if (parent.parent) {
        throw new BadRequestException(
          'Só é permitido responder a um comentário raiz',
        );
      }
    }

    const saved = await this.commentsRepository.save(
      this.commentsRepository.create({
        content: dto.content,
        post: { id: postId } as Post,
        author: { id: userId } as User,
        parent: parent ? ({ id: parent.id } as Comment) : null,
      }),
    );

    // Recarrega com o autor (eager) para devolver o DTO completo.
    const created = await this.commentsRepository.findOneOrFail({
      where: { id: saved.id },
    });
    return this.toCommentDto(created, []);
  }

  private async countByPost(
    repo: Repository<Comment> | Repository<PostLike>,
    postIds: string[],
  ): Promise<Map<string, number>> {
    if (postIds.length === 0) {
      return new Map();
    }
    const rows = await repo
      .createQueryBuilder('row')
      .leftJoin('row.post', 'post')
      .select('post.id', 'postId')
      .addSelect('COUNT(*)', 'count')
      .where('post.id IN (:...postIds)', { postIds })
      .groupBy('post.id')
      .getRawMany<{ postId: string; count: string }>();
    return new Map(rows.map((row) => [row.postId, Number(row.count)]));
  }

  private async likedPostIds(
    postIds: string[],
    userId?: string,
  ): Promise<Set<string>> {
    if (!userId || postIds.length === 0) {
      return new Set();
    }
    const likes = await this.likesRepository.find({
      where: { post: { id: In(postIds) }, user: { id: userId } },
      relations: { post: true },
    });
    return new Set(likes.map((like) => like.post.id));
  }

  private buildCommentTree(comments: Comment[]): CommentDto[] {
    const roots = comments.filter((comment) => !comment.parent);
    const repliesByParent = new Map<string, Comment[]>();
    for (const comment of comments) {
      if (comment.parent) {
        const list = repliesByParent.get(comment.parent.id) ?? [];
        list.push(comment);
        repliesByParent.set(comment.parent.id, list);
      }
    }
    return roots.map((root) =>
      this.toCommentDto(
        root,
        (repliesByParent.get(root.id) ?? []).map((reply) =>
          this.toCommentDto(reply, []),
        ),
      ),
    );
  }

  private toCommentDto(comment: Comment, replies: CommentDto[]): CommentDto {
    return {
      id: comment.id,
      content: comment.content,
      author: this.toAuthor(comment.author),
      replies,
      createdAt: comment.createdAt,
    };
  }

  private toSummary(
    post: Post,
    counts: { likesCount: number; commentsCount: number; likedByMe: boolean },
  ): PostSummaryDto {
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      thumbnailUrl: post.thumbnailUrl,
      tags: post.tags ?? [],
      author: this.toAuthor(post.author),
      likesCount: counts.likesCount,
      commentsCount: counts.commentsCount,
      likedByMe: counts.likedByMe,
      createdAt: post.createdAt,
    };
  }

  private toAuthor(user: User): PostAuthorDto {
    return {
      id: user.id,
      name: user.name,
      username: `@${user.email.split('@')[0]}`,
    };
  }
}
