import { Body, Controller, Post, Req, Get } from '@nestjs/common';
import { saveInterestsDto } from './dto/save-interests.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/labs-community')
  async setMemberOfLabsCommunity(@Req() req) {
    return await this.usersService.setMemberOfLabsCommunity(req);
  }

  @Post('/interests')
  async saveInterests(@Body() interestsDto: saveInterestsDto, @Req() req) {
    return await this.usersService.saveInterests(interestsDto, req.user._id);
  }

  @Get()
  async findOne(@Req() req) {
    return this.usersService.findOne(req.user);
  }
}
