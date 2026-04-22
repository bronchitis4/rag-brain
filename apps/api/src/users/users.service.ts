import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOrCreate(email: string, name?: string) {
    let user = await this.usersRepository.findByEmail(email);

    if (!user) {
      user = await this.usersRepository.create({
        email,
        name,
      });
    }

    return user;
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }
}
