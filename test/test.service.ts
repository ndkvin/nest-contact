import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { Contact } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteAll(): Promise<void> {
    await this.deleteContact();
    await this.deleteUser();
  }

  async deleteUser(): Promise<void> {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deleteContact(): Promise<void> {
    await this.prismaService.contact.deleteMany({
      where: {
        first_name: 'test',
      },
    });
  }

  async createUser(): Promise<void> {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        password: await bcrypt.hash('testtest', 10),
        name: 'test',
        token: 'test',
      },
    });
  }

  async createDummyUser(): Promise<void> {
    await this.prismaService.user.create({
      data: {
        username: 'testing',
        password: await bcrypt.hash('testtest', 10),
        name: 'test',
        token: 'test',
      },
    });
  }
  
  async deleteDummyUser(): Promise<void> {
    await this.prismaService.user.delete({
      where: {
        username: "testing"
      }
    })
  }

  async createContact(): Promise<Contact> {
    return await this.prismaService.contact.create({
      data: {
        first_name: 'test',
        last_name: 'test',
        phone: '08123456789',
        email: 'test@gmail.com',
        users: {
          connect: {
            username: 'test',
          },
        },
      },
    });
  }
}
