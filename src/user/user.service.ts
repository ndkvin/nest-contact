import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  RegisterUserRequest,
  UserResponse,
  LoginUserRequest,
  UpdateUserRequest,
} from 'src/model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Registering new user ${JSON.stringify(request)}`);
    const registerRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    );

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername > 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`Logging in user ${JSON.stringify(request)}`);
    const loginRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isPasswordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException('Invalid password', 401);
    }

    const token = uuid();

    await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token,
      },
    });

    return {
      username: user.username,
      name: user.name,
      token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }

  async logout(username: string): Promise<UserResponse> {
    this.logger.info(`Logging out user ${username}`);
    const user = await this.prismaService.user.update({
      where: {
        username,
      },
      data: {
        token: null,
      },
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async update(
    username: string,
    request: UpdateUserRequest,
  ): Promise<UserResponse> {
    this.logger.info(`Updating user ${username} with ${JSON.stringify(request)}`);
    const updateRequest = await this.validationService.validate(UserValidation.UPDATE, request);
    const user = await this.prismaService.user.update({
      where: {
        username,
      },
      data: {
        name: updateRequest.name,
      },
    });

    return {
      username: user.username,
      name: user.name,
    };
  }
}
