import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userservice: UsersService,
        private jwtService: JwtService
    ){}

    async signIn(username: string, pass: string): Promise<{access_token: string}>{

        const user = await this.userservice.findOne(username)

        if (user?.password !== pass){
            throw new UnauthorizedException()
        }
        //TODO add une fonction de Hash pour stocker et comparer les hash des passwords et non leur str plaintext
        const payload = {sub: user.userId, username: user.username}

        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
