import { ApiProperty } from '@nestjs/swagger';

export class PostAuthorDto {
  @ApiProperty({ example: '9a72b703-896e-4043-be66-59f0536fab97' })
  id: string;

  @ApiProperty({ example: 'Júlio' })
  name: string;

  @ApiProperty({ example: '@julio' })
  username: string;
}
