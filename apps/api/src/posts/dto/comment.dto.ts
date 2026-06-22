import { ApiProperty } from '@nestjs/swagger';
import { PostAuthorDto } from './post-author.dto';

export class CommentDto {
  @ApiProperty({ example: '9a72b703-896e-4043-be66-59f0536fab97' })
  id: string;

  @ApiProperty({ example: 'Achei muito bom seu código, parabéns!' })
  content: string;

  @ApiProperty({ type: PostAuthorDto })
  author: PostAuthorDto;

  @ApiProperty({ type: () => [CommentDto] })
  replies: CommentDto[];

  @ApiProperty({ example: '2026-06-22T12:00:00.000Z' })
  createdAt: Date;
}
