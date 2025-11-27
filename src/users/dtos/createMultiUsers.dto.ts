import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from './createUser.dto';
import { Type } from 'class-transformer';

export class CreateMultiUsersDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
