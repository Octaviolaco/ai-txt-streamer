import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    signUp(@Body() signUpDto: Record<string,any>){
        this.authService.signUp(signUpDto.username,signUpDto.password)
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@Body() credentials: Record<string, any>){
        this.authService.logout(credentials.acess_token,credentials.refresh_token);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh/acess_token')
    refreshAcessToken(@Body() credentials: Record<string, any>){
        this.authService.refreshaccessToken(credentials.username,credentials.refresh_token);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh/refresh_token')
    refreshRefreshToken(@Body() credentials: Record<string, any>){
        this.authService.refreshRefreshToken(credentials.username,credentials.refresh_token);
    }

}
