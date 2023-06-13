import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async login(@Body() credentials: LoginDTO) {
    return this.authService.login(credentials);
  }
}
