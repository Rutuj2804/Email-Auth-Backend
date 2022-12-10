import { Injectable } from '@nestjs/common';
import { ResetPasswordDTO, UserDTO } from './dto';
import { MailerService } from "@nestjs-modules/mailer"
import { v4 as uuidV4 } from "uuid"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from 'mongoose';
import * as argon from "argon2"
import { ForgotInterface, UserInterface, VerificationInterface } from './interface';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class EmailService {

    constructor(private mailService: MailerService, private jwt:JwtService, private config:ConfigService, @InjectModel("Verification") private verificationModel:Model<VerificationInterface>, @InjectModel("User") private userModel:Model<UserInterface>, @InjectModel("Forgot Password") private forgotModel:Model<ForgotInterface>) {}

    async register(userDTO: UserDTO) {
        try {
            const uid = uuidV4()

            const hash = await argon.hash(userDTO.password);

            const user = new this.userModel({ email: userDTO.email, password: hash, name: userDTO.name })
            await user.save()

            const verificationInstance = new this.verificationModel({ user: user._id, verificationID: uid })
            await verificationInstance.save()

            await this.mailService.sendMail({
                to: userDTO.email,
                from: "rutujbokade36@gmail.com",
                subject: "Email verification",
                text: `Click on the link below to verify your email
                        http://localhost:5000/verify/${uid}`
            })

            return { msg: "Check your mail for email verification" }
            
        } catch (error) {
            if(error.code === 11000){
                throw new ForbiddenException("Credentials already taken")
            }
            throw error
        }
    }

    async login(dto: UserDTO) {
        // find user
        const user = await this.userModel.findOne({ email: dto.email })
        // if does not exist throw error
        if(!user) throw new ForbiddenException("Invalid credentials")
        
        // compare password
        const pwMatches = await argon.verify(user.password, dto.password)
        // if password not matching throw error
        if(!pwMatches) throw new ForbiddenException("Invalid credentials")

        // send user
        return this.signToken(`${user._id}`, user.email)
    }

    async signToken(userID: string, email: string): Promise<{ token: string }>{
        const data = {
            sub: userID,
            email
        }

        const secret = this.config.get("JWT_SECRET")

        const token = await this.jwt.signAsync(data, {
            secret: secret
        })

        return {
            token: token
        }
    }

    async verifyEmail(id:string) {
        try {
            const verifyInstance = await this.verificationModel.find({ verificationID: id })
            
            if(!verifyInstance.length) throw new ForbiddenException("Incorrect verification credentials")

            await this.userModel.findByIdAndUpdate(verifyInstance[0].user, { isVerified: true })

            await this.verificationModel.findOneAndDelete({ verificationID: id })

            return { msg: "Email verified successfully" }
        } catch (error) {
            throw new ForbiddenException(error.message)
        }
    }

    async resendRegistration(email: string) {
        const userInstance = await this.userModel.findOne({ email: email })

        if(userInstance.isVerified) throw new ForbiddenException("Email already verified")

        const verifyInstance = await this.verificationModel.findOne({ user: userInstance._id })
        
        await this.mailService.sendMail({
            to: email,
            from: "rutujbokade36@gmail.com",
            subject: "Email verification",
            text: `Click on the link below to verify your email
                    http://localhost:5000/verify/${verifyInstance.verificationID}`
        })  

        return { msg: "Check your mail to verify your email" }
    }

    async resendForgot(email: string) {
        const userInstance = await this.userModel.findOne({ email: email })

        if(userInstance.isVerified) throw new ForbiddenException("Email already verified")

        const verifyInstance = await this.forgotModel.findOne({ user: userInstance._id })
        
        await this.mailService.sendMail({
            to: email,
            from: "rutujbokade36@gmail.com",
            subject: "Email verification",
            text: `Click on the link below to reset your password
                    http://localhost:5000/verify/${verifyInstance.forgotID}`
        })  

        return { msg: "Check your mail to reset your password" }
    }

    async resetPassword(id: string, resetPasswordDTO: ResetPasswordDTO) {
        try {
            const forgotPasswordInstance = await this.forgotModel.find({ forgotID: id })
            
            if(!forgotPasswordInstance.length) throw new ForbiddenException("Incorrect credentials")

            if(resetPasswordDTO.password !== resetPasswordDTO.confirmpassword) throw new ForbiddenException("Both passwords must match")

            const hash = await argon.hash(resetPasswordDTO.password);

            await this.userModel.findByIdAndUpdate(forgotPasswordInstance[0].user, { password: hash })

            await this.forgotModel.findOneAndDelete({ forgotID: id })

            return { msg: "Email verified successfully" }
        } catch (error) {
            throw new ForbiddenException(error.message)
        }
    }

    async forgotPassword(email: string) {
        const userInstance = await this.userModel.findOne({ email: email })
        if(!userInstance) throw new ForbiddenException("User with this email does not exist")

        const uid = uuidV4()

        const forgotInstance = new this.forgotModel({ user: userInstance._id, forgotID: uid })
        await forgotInstance.save()

        await this.mailService.sendMail({
            to: email,
            from: "rutujbokade36@gmail.com",
            subject: "Email verification",
            text: `Click on the link below to verify your email
                    http://localhost:5000/verify/${uid}`
        })

        return { msg: "Check your email to reset password" }
    }
}
