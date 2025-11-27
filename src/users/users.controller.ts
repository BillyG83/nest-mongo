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
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getUsers(
    @Param() getUserParamDto: GetUsersParamDto,
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
    return this.usersService.findAll(getUserParamDto, limit, page);
  }

  @Get(':id')
  public getUser(@Param() getUserParamDto: GetUsersParamDto) {
    return this.usersService.finByOneById(getUserParamDto.id);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
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
