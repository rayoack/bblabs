import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  Query,
  Request,
} from '@nestjs/common';
import { saveInterestsDto } from './dto/save-interests.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  async findAll(
    @Request() req,
    @Query('created_between') created_between,
    @Query('name') name,
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ) {
    return await this.usersService.findAll(
      {
        limit,
        page,
        route: req.url,
      },
      created_between,
      name,
    );
  }

  @Get()
  async findOne(@Req() req) {
    return this.usersService.findOne(req.user);
  }
}
