import { ApiProperty } from '@nestjs/swagger';
import { PostAuthorDto } from './post-author.dto';

export class PostSummaryDto {
  @ApiProperty({ example: '9a72b703-896e-4043-be66-59f0536fab97' })
  id: string;

  @ApiProperty({ example: 'titulo-do-post' })
  slug: string;

  @ApiProperty({ example: 'Título do post em duas linhas' })
  title: string;

  @ApiProperty({ example: 'At vero eos et accusamus et iusto odio...' })
  description: string;

  @ApiProperty({ example: 'https://...', nullable: true })
  thumbnailUrl: string | null;

  @ApiProperty({ example: ['React', 'Acessibilidade'] })
  tags: string[];

  @ApiProperty({ type: PostAuthorDto })
  author: PostAuthorDto;

  @ApiProperty({ example: 12 })
  likesCount: number;

  @ApiProperty({ example: 4 })
  commentsCount: number;

  @ApiProperty({ example: false })
  likedByMe: boolean;

  @ApiProperty({ example: '2026-06-22T12:00:00.000Z' })
  createdAt: Date;
}
