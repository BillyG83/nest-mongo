import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id')
  public getUsers(@Param() params: { id: string }, @Query() query: any) {
    console.log(query);
    return `You request user: ${params.id}`;
  }

  @Post()
  public createUsers(@Body() request: any) {
    console.log(request);
    return 'You sent a post request to users endpoint';
  }

  @Patch()
  public updateUsers() {
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
