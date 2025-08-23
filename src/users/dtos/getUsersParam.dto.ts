import { IsOptional, IsInt } from 'class-validator';

export class GetUsersParamDto {
  @IsOptional()
  @IsInt()
  id: number;
}
