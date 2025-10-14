import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/CreateReportDto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create({ ...reportDto, user });
    return this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;

    return this.repo.save(report);
  }

  getEstimate(query: GetEstimateDto) {
    console.log('query', query);
    return this.repo //
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: query.make })
      .andWhere('model = :model', { model: query.model })
      .andWhere('lng - :lng between -5 and 5', {
        lng: query.lng,
      })
      .andWhere('lat - :lat between -5 and 5', {
        lat: query.lat,
      })
      .andWhere('year - :year between -3 and 3', {
        year: query.year,
      })
      .andWhere('approved is true')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameter('mileage', query.mileage)
      .limit(3)
      .getRawOne();
  }
}
