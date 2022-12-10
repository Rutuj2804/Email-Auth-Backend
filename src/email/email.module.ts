import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema, verificationSchema, forgotSchema } from './module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [MongooseModule.forFeature([{ name: "User", schema: userSchema }, { name: "Verification", schema: verificationSchema }, { name: "Forgot Password", schema: forgotSchema }]), JwtModule.register({})],
    controllers:[EmailController],
    providers: [EmailService]
})
export class EmailModule {}
