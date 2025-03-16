import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BookingStatus } from 'src/enums/booking-status.enum';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('removeUser') private removeUser: Queue,
  ) {}
  sendVerificationEmail(otp: string, emailAddress: string) {
    const email = {
      subject: 'airport management system account verification',
      text: `otp is ${otp}`,
      to: emailAddress,
    };
    this.emailQueue.add('verify use email', email);
  }

  sendRestPasswordEmail(otp: string, emailAddress: string) {
    const email = {
      subject: 'airport management system password reset',
      text: `otp is ${otp}`,
      to: emailAddress,
    };
    this.emailQueue.add('password reset email', email);
  }

  removeUserIfNotVerified(userId: number) {
    this.removeUser.add(
      'remove unverified user',
      { userId },
      { delay: 2 * 60 * 60 * 1000 }, // remove a user if not verified in 2 hours
    );
  }

  manageBookingEmail(
    flightNumber: string,
    emailAddress: string,
    bookingStatus: BookingStatus,
  ) {
    if (bookingStatus === BookingStatus.PENDING) {
      return;
    }
    const email = {
      subject: 'flight booking update',
      text: `Your booking has been ${bookingStatus === BookingStatus.CANCELLED ? 'cancelled' : 'confirmed'}.\nFlight Number: ${flightNumber}`,
      to: emailAddress,
    };
    console.log(email);

    this.emailQueue.add('password reset email', email);
  }
}
