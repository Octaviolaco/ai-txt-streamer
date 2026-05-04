import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { paginationResponseFromJSON } from '@mistralai/mistralai/models/components';

@Injectable()
export class AuthService {
    constructor(
        private  userservice: UserService,
        private jwtService: JwtService
    ){}

    async getTokens(userId: number, username: string){
        const payload = {sub: userId, username: username}
        const access_token = await this.jwtService.signAsync(payload,{
            secret:process.env.JWT_ACCESS_SECRET,
            expiresIn: '60s',
        })
        const refresh_token = await this.jwtService.signAsync(payload,{
            secret:process.env.JWT_REFRESH_SECRET,
            expiresIn: '15m',
        })
        return {access_token,refresh_token}
    }

    async signIn(username: string, pass: string){

        const user = await this.userservice.findOne(username)
        if (!user){
            console.log('Username not recognized',username)
            throw new UnauthorizedException('Username not recognized')
        }
        const isMatch = await bcrypt.compare(pass,user.password)

        if (!isMatch){
            console.log('WrongPassword')
            throw new UnauthorizedException()
        }
        const payload = {sub: user.id, username: user.username}
        const tokens = await this.getTokens(user.id, user.username)
        const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 10)

        await this.userservice.updateRefreshToken(user.id,hashedRefreshToken)

        return tokens
    }

    async signUp(username: string, password: string){
        await this.userservice.create({username: username, password: password})
    }

    async logout(accessToken: string, refreshToken: string){}   
    
    async refreshaccessToken(username: string, refreshToken: string){
        const user = await this.userservice.findOne(username)
        
        if (!user){
            console.log('Unrecognized username',username)
            throw new ForbiddenException('Unkown username')
        }
        if (user.refreshToken){
            const isMatch = await bcrypt.compare(refreshToken,user.refreshToken )

            if (!isMatch){
            console.log('Refresh tokens do not correspond')
            throw new ForbiddenException('refreshToken not valid')
            }
        }
        else{
            console.log('No refresh token stored')
            throw new ForbiddenException('refreshToken not valid')
        }

        const payload = {sub: user.id, username: username}
        const accessToken = await this.jwtService.signAsync(payload,{
            secret:process.env.JWT_ACCESS_SECRET,
            expiresIn: '60s',
        })

        return accessToken
    }

    async refreshRefreshToken(username: string, refreshToken: string){
        const user = await this.userservice.findOne(username)
        if (!user){
            console.log('Unrecognized username',username)
            throw new ForbiddenException('Unkown username')
        }
        if (user.refreshToken){
            const isMatch = await bcrypt.compare(refreshToken,user.refreshToken )

            if (!isMatch){
            console.log('Refresh tokens do not correspond')
            throw new ForbiddenException('refreshToken not valid')
            }
        }
        else{
            console.log('No refresh token stored')
            throw new ForbiddenException('refreshToken not valid')
        }

        const payload = {sub: user.id, username: username}
        const newRefreshToken = await this.jwtService.signAsync(payload,{
            secret:process.env.JWT_REFRESH_SECRET,
            expiresIn: '15m',
        })

        return newRefreshToken
    }
}
