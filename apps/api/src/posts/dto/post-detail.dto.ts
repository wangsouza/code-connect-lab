import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';
import { PostSummaryDto } from './post-summary.dto';

export class PostDetailDto extends PostSummaryDto {
  @ApiProperty({ example: 'const soma = (a, b) => a + b;' })
  content: string;

  @ApiProperty({ type: [CommentDto] })
  comments: CommentDto[];
}
