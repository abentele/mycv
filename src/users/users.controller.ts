import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth/auth.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  createUser(@Body() data: CreateUserDto) {
    return this.authService.signup(data.email, data.password);
  }

  @Post('signin')
  async signin(@Body() data: CreateUserDto) {
    return this.authService.signin(data.email, data.password);
  }

  @Get(':id')
  async findUser(@Param('id') id: number) {
    console.log('Handler is running');
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: number,
    @Body() attrs: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, attrs);
  }

  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
