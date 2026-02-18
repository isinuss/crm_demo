import { Injectable } from '@nestjs/common';
import { ContactsService } from '../contacts/contacts.service';
import { CompaniesService } from '../companies/companies.service';
import { DealsService } from '../deals/deals.service';
import { ActivitiesService } from '../activities/activities.service';
import { DashboardStatsType } from './dashboard.resolver';

@Injectable()
export class DashboardService {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly companiesService: CompaniesService,
    private readonly dealsService: DealsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async getStats(workspaceId: string): Promise<DashboardStatsType> {
    const [
      totalContacts,
      totalCompanies,
      totalDeals,
      openDealsValue,
      wonDealsValue,
      recentActivities,
    ] = await Promise.all([
      this.contactsService.count(workspaceId),
      this.companiesService.count(workspaceId),
      this.dealsService.count(workspaceId),
      this.dealsService.sumOpenDeals(workspaceId),
      this.dealsService.sumWonDeals(workspaceId),
      this.activitiesService.recentActivities(workspaceId, 5),
    ]);

    return {
      totalContacts,
      totalCompanies,
      totalDeals,
      openDealsValue,
      wonDealsValue,
      recentActivities,
    };
  }
}
