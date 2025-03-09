import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(configService.getOrThrow('SENDGRID_API_KEY'));
  }

  async sendEmail(msg) {
    msg.from = this.configService.getOrThrow('SENDGRID_EMAIL');
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
