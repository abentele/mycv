import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  createUser(data: CreateUserDto) {
    // need to create the object first to get the entity hooks to be called!
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findOne(id: number): Promise<User | null> {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  find(email: string): Promise<User[]> {
    return this.repo.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    this.repo.remove(user);
  }
}
