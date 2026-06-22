import { ApiProperty } from '@nestjs/swagger';
import { PostSummaryDto } from './post-summary.dto';

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  limit: number;

  @ApiProperty({ example: 37 })
  total: number;

  @ApiProperty({ example: 4 })
  totalPages: number;
}

export class PaginatedPostsDto {
  @ApiProperty({ type: [PostSummaryDto] })
  data: PostSummaryDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
