import { IsInt } from 'class-validator';

export class GetUsersParamDto {
  @IsInt()
  id: number;
}
