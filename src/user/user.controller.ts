import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import { RegisterUserRequest, UserResponse } from '../model/user.model';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.register(request);

    return {
      data: user,
    };
  }
}
