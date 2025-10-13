import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { find } from 'rxjs';
import { CreateUserDto } from '../dtos/CreateUser.dto';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve([]);
      },
      createUser: (data: CreateUserDto) => {
        return Promise.resolve({
          id: 1,
          email: data.email,
          password: data.password,
        } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signup creates a new user with a salted an hashed password', async () => {
    const user = await service.signup('test@example.com', 'asdf');
    expect(user.email).toEqual('test@example.com');
    expect(user.password).not.toEqual('asdf');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = (_email: string) =>
      Promise.resolve([
        { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
      ]);
    await expect(service.signin('asdf@asdf.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    fakeUsersService.find = (_email: string) =>
      Promise.resolve([
        {
          email: 'asdf@asdf.com',
          password:
            '39cce2370a3e7c64.b7a13a0642f52ed2dcf92c33e87cdd775dffa9c1bc63e6d22da261a3125ad0df',
        } as User,
      ]);
    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
