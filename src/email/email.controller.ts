import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { ResetPasswordDTO, UserDTO } from './dto';
import { EmailService } from './email.service';

@Controller('auth')
export class EmailController {

    constructor(private emailService: EmailService) {}

    @Post("register")
    register(@Body() userDTO: UserDTO) {
        return this.emailService.register(userDTO)
    }

    @Post("resend")
    resendRegistration(@Body("email") email: string) {
        return this.emailService.resendRegistration(email)
    }

    @Post("forgot-password/resend")
    resendForgot(@Body("email") email: string) {
        return this.emailService.resendForgot(email)
    }

    @Get("verify/:id") 
    verifyEmail(@Param("id") id:string) {
        return this.emailService.verifyEmail(id)
    }

    @Put("verify/:id") 
    resetPassword(@Param("id") id:string, @Body() resetPasswordDTO: ResetPasswordDTO) {
        return this.emailService.resetPassword(id, resetPasswordDTO)
    }

    @Post("login")
    login(@Body() userDTO: UserDTO) {
        return this.emailService.login(userDTO)
    }

    @Post("forgot")
    forgotPassword(@Body("email") email:string) {
        return this.emailService.forgotPassword(email)
    }
}
