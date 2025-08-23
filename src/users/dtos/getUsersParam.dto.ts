import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'Get user with a specific Id, or get all users',
    example: 1234,
  })
  @IsOptional()
  @IsInt()
  id?: number;
}
