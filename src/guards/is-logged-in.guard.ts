import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/enums/user-roles.enum';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class IsLoggedIn implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('unauthorized access');
    }
    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.authService.getUserById(decoded.userId);
      console.log(user);

      if (!user || !user.verified) throw new Error();
      const requiredRole = this.reflector.get<UserRole>(
        'role',
        context.getHandler(),
      );
      if (requiredRole && requiredRole != user.role) {
        throw new Error();
      }
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('unauthorized access');
    }
  }
}
