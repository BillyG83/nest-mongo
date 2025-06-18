import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { GetUsersParamDto } from './dtos/getUsersParam.dto';
import { PatchUserDto } from './dtos/patchUser.dto';

@Controller('users')
export class UsersController {
  @Get()
  public getUsers(
    @Query(
      'limit',
      new DefaultValuePipe(10),
      new ParseIntPipe({ optional: true }),
    )
    limit?: number,
    @Query(
      'page',
      new DefaultValuePipe(1),
      new ParseIntPipe({ optional: true }),
    )
    page?: number,
  ) {
    return `Getting all users with limit of ${limit} on page ${page}`;
  }

  @Get(':id')
  public getUser(@Param() getUserParamDto: GetUsersParamDto) {
    return `Getting user ${getUserParamDto.id}`;
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'You sent a post request to users endpoint';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'You sent a patch request to users endpoint';
  }

  @Put()
  public putUsers() {
    return 'You sent a put request to users endpoint';
  }

  @Delete()
  public removeUsers() {
    return 'You sent a delete request to users endpoint';
  }
}
