import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot("mongodb+srv://rutuj:rutuj@cluster0.9xzzlri.mongodb.net/EmailVerification?retryWrites=true&w=majority"),
    EmailModule,
    MailerModule.forRoot({
      transport: {
        host: "smtp.sendgrid.net",
        auth: {
          user: "apikey",
          pass: "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"
        }
      },
      template: {
        dir: join(__dirname, "template"),
        adapter: new HandlebarsAdapter()
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
