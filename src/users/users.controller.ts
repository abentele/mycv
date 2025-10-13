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
  Session,
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

  @Get('whoami')
  whoAmI(@Session() session: any) {
    return this.usersService.findOne(session.userId);
  }

  @Post('signup')
  async createUser(@Body() data: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(data.email, data.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() data: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(data.email, data.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signout(@Session() session: any) {
    session.userId = null;
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
