import { IsInt, IsOptional } from 'class-validator';

export class GetUsersParamDto {
  @IsInt()
  @IsOptional()
  id?: number;
}
