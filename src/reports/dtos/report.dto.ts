import { Expose, Transform } from 'class-transformer';
import { Report } from '../report.entity';

export class ReportDto {
  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;
}
