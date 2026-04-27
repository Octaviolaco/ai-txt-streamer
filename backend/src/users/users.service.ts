
import { Injectable } from '@nestjs/common';

export type User = any;

//TODO: store the userlist elswher than in the core code
@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  //TODO: Implement a real user-adding function (and delete account?)
  async addOne(username: string, password: string): Promise<User | undefined > {
    this.users.push(
        {
            userId: 3,
            username: username,
            password: password
        }
    )
  }
}

