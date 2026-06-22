import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post as HttpPost,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtPayload } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedPostsDto } from './dto/paginated-posts.dto';
import { PostDetailDto } from './dto/post-detail.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiOkResponse({ type: PaginatedPostsDto })
  findAll(
    @Query() query: FindPostsQueryDto,
    @Req() request: Request,
  ): Promise<PaginatedPostsDto> {
    return this.postsService.findAll(query, this.userId(request));
  }

  @Get(':slug')
  @UseGuards(OptionalAuthGuard)
  @ApiOkResponse({ type: PostDetailDto })
  findOne(
    @Param('slug') slug: string,
    @Req() request: Request,
  ): Promise<PostDetailDto> {
    return this.postsService.findOneBySlug(slug, this.userId(request));
  }

  @HttpPost(':id/likes')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Post curtido' })
  like(@Param('id') id: string, @Req() request: Request): Promise<void> {
    return this.postsService.like(id, this.requireUserId(request));
  }

  @Delete(':id/likes')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Curtida removida' })
  unlike(@Param('id') id: string, @Req() request: Request): Promise<void> {
    return this.postsService.unlike(id, this.requireUserId(request));
  }

  @HttpPost(':id/comments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CommentDto })
  createComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Req() request: Request,
  ): Promise<CommentDto> {
    return this.postsService.createComment(
      id,
      this.requireUserId(request),
      dto,
    );
  }

  private userId(request: Request): string | undefined {
    return (request['user'] as JwtPayload | undefined)?.sub;
  }

  private requireUserId(request: Request): string {
    return (request['user'] as JwtPayload).sub;
  }
}
