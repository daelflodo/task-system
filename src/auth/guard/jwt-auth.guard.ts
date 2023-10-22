import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
//   import * as dotenv from 'dotenv';
//   dotenv.config();
//   const { JWT_SECRET } = process.env;
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(
      private readonly jwtService: JwtService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('You do not have an authorization token');
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        //* request['user'] = payload;
        request.user = payload;
      } catch {
        throw new UnauthorizedException('You do not have authorization');
      }
  
      return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  