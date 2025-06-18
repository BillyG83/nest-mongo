import { IsNotEmpty, IsInt } from 'class-validator';

export class GetUsersParamDto {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
