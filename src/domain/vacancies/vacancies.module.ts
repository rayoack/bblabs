import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancies } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancies])],
})
export class VacanciesModule {}
