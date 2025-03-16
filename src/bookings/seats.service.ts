import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entities/seats.entity';
import { Repository } from 'typeorm';
import { Flight } from 'src/flights/entities/flight.entity';
import { Booking } from './entities/bookings.entity';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
  ) {}

  async storeFlightSeats(flight: Flight) {
    const seats: Promise<any>[] = [];
    for (let i = 0; i < flight.availableSeats; i++) {
      let seat = this.seatRepository.create({
        flight,
        seatNumber: `${String.fromCharCode(65 + (i % 6))}${Math.floor((i + 1) / 6)}`,
      });
      this.seatRepository.save(seat);
    }
    await Promise.all(seats);
  }

  async bookSeat(flight: Flight) {
    const seat = await this.seatRepository.findOne({
      where: {
        flight,
        available: true,
      },
    });

    if (!seat) throw new InternalServerErrorException();
    seat.available = false;
    return this.seatRepository.save(seat);
  }

  async getSeat(booking: Booking) {
    return this.seatRepository.findOne({
      where: {
        booking,
      },
    });
  }
}
