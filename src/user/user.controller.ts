import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from '../model/user.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.register(request);

    return {
      data: user,
    };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.login(request);

    return {
      data: user,
    };
  }

  @Get('/current')
  @HttpCode(HttpStatus.OK)
  async current(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user)

    return {
      data: result,
    };
  }

  @Delete('/current')
  @HttpCode(HttpStatus.OK)
  async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
    await this.userService.logout(user.username);

    return {
      data: true,
    };
  }
}
