import { Controller, Get } from '@nestjs/common';
import { AuthService } from './providers/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  public getAuthPerUser() {
    return this.authService.login('email', 'password', 'id');
  }
}
