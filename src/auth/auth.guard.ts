import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    const token = (authHeaders as string).split(' ')[1];
    console.log('token', token);
    try {
      const response = await this.authService.validateToken(token);
      req.user = { ...response, token };
      return true;
    } catch (error) {}
    return false;
  }
}
