import { Module } from '@nestjs/common';
import { ContactsModule } from '../contacts/contacts.module';
import { CompaniesModule } from '../companies/companies.module';
import { DealsModule } from '../deals/deals.module';
import { ActivitiesModule } from '../activities/activities.module';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';

@Module({
  imports: [ContactsModule, CompaniesModule, DealsModule, ActivitiesModule],
  providers: [DashboardService, DashboardResolver],
})
export class DashboardModule {}
