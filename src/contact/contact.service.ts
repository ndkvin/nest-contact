import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ContactResponse, CreateContactRequest, UpdateContactRequest } from 'src/model/contact.model';
import { ContactValidation } from './contact.validation';
import { Contact, User } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async toContactResponse(contact: Contact): Promise<ContactResponse> {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      phone: contact.phone,
      email: contact.email,
    };
  }

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.info(`Creating contact ${JSON.stringify(request)}`);
    const contactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );

    const contact = await this.prismaService.contact.create({
      data: {
        ...contactRequest,
        ...{
          username: user.username,
        },
      },
    });

    return this.toContactResponse(contact);
  }

  async update(request: UpdateContactRequest, id: number): Promise<ContactResponse> {
    this.logger.info(`Updating contact ${JSON.stringify(request)}`);
    const contactRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    );

    const contact = await this.prismaService.contact.update({
      where: {
        id: id,
      },
      data: {
        ...contactRequest,
      },
    });

    return this.toContactResponse(contact);
  }
}
