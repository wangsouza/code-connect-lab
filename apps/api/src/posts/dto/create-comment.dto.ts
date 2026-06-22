import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Muito bom! Parabéns pelo post.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    example: '9a72b703-896e-4043-be66-59f0536fab97',
    description: 'Id do comentário raiz quando esta é uma resposta',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
