import { forwardRef, Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { AirportsModule } from 'src/airports/airports.module';

@Module({
  imports: [forwardRef(() => AirportsModule)],
  exports: [DataloaderService],
  providers: [DataloaderService],
})
export class DataloaderModule {}
