import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private UserRepo: Repository<User>){}

  async create(createUserDto: CreateUserDto) {
    const user = await this.UserRepo.create(createUserDto);
    return await this.UserRepo.save(createUserDto)
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string) {
    return await this.UserRepo.findOne({
      where: {
        username
      }
    })
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.UserRepo.update({id},{refreshToken})
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
