export class RegisterUserRequest {
  username: string;
  password: string;
  name: String;
}

export class UserResponse {
  username: string;
  name: String;
  token?: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}
