import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
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
    const result = await this.contactService.create(user.username, request);

    return {
      data: result,
    };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async get(
    @Param('id', ParseIntPipe) id: number,
    @Auth() user: User,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.get(user.username, id);

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
    const result = await this.contactService.update(user.username, id, request);

    return {
      data: result,
    };
  }
}
