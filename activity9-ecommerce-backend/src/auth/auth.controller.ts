import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../utils/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async signup(
    @Body() signupDto: SignupDto,
  ) {
    const { email, password, firstName, lastName, role } = signupDto;
    return this.authService.signup(email, password, firstName, lastName, role);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async login(
    @Body() loginDto: LoginDto,
  ) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Get('debug/users')
  @ApiOperation({ summary: 'Get all users (debug)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async debugGetUsers() {
    return this.authService.getAllUsers();
  }
}
