import { BadRequestException, Injectable } from '@nestjs/common';
import { Booking } from './entities/bookings.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeatsService } from './seats.service';
import { FlightsService } from 'src/flights/flights.service';
import { PassengersService } from 'src/users/passengers.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    private seatsService: SeatsService,
    private flightsService: FlightsService,
    private passengerService: PassengersService,
  ) {}

  async bookFlight(flightNumber: string, user: User) {
    const passenger = await this.passengerService.getPassengerByUser(user);
    if (!passenger)
      throw new BadRequestException('passenger data does not exist');

    const flight =
      await this.flightsService.findFlightByFlightNumber(flightNumber);
    if (flight.availableSeats == 0)
      throw new BadRequestException('All seats are booked');
    if (
      await this.bookingRepository.exists({
        where: {
          flight,
          passenger,
        },
      })
    ) {
      throw new BadRequestException('user already booked a flight');
    }

    const seat = await this.seatsService.bookSeat(flight);
    if (!seat) throw new BadRequestException('No seats available');
    else await this.flightsService.bookSeat(flight);

    const booking = this.bookingRepository.create({
      flight,
      seat,
      passenger,
    });
    return this.bookingRepository.save(booking);
  }
}
