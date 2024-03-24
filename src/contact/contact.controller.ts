import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactResponse, CreateContactRequest } from '../model/contact.model';
import { WebResponse } from 'src/model/web.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.create(user, request);

    return {
      data: result,
    };
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.update(request, id);

    return {
      data: result,
    };
  }
}
