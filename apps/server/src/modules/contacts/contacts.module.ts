import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactEntity } from '../../common/entities/contact.entity';
import { CompanyEntity } from '../../common/entities/company.entity';
import { ContactsService } from './contacts.service';
import { ContactsResolver } from './contacts.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity, CompanyEntity])],
  providers: [ContactsService, ContactsResolver],
  exports: [ContactsService],
})
export class ContactsModule {}
