import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteUser(): Promise<void> {
    await this.prismaService.user.deleteMany({
      where: {
        username: "test"
      }
    });
  }

  async createUser(): Promise<void> {
    await this.prismaService.user.create({
      data: {
        username: "test",
        password: "testtest",
        name: "test"
      }
    });
  }
}