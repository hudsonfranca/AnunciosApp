import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/user.entity';
import { keys } from '../keys';

@Injectable()
export class SendEmail {
  constructor(private mailerService: MailerService) {}

  public async send(params: {
    user: User;
    context: { [key: string]: any };
    subject: string;
    template: string;
  }) {
    const { context, subject, template, user } = params;
    const email: ISendMailOptions = {
      to: user.email,
      from: keys.emailAddress,
      subject,
      template,
      context,
    };

    try {
      return await this.mailerService.sendMail(email);
    } catch (error) {
      throw new InternalServerErrorException(
        'confirmation email cannot be sent',
      );
    }
  }
}
