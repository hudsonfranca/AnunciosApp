import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { keys } from '../keys';

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(__dirname, '..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', 'templates'),
    },
  },
  transport: `smtps://${keys.emailAddress}:${keys.emailPassword}@smtp.gmail.com`,
};
