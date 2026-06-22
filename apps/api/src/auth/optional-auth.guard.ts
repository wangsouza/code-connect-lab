import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { jwtConstants } from '../constants';
import { JwtPayload } from './auth.service';

/**
 * Guard de autenticação opcional: se houver um Bearer token válido, popula
 * `request.user`; caso contrário segue adiante sem erro. Usado em rotas
 * públicas que precisam de contexto do usuário quando ele está logado
 * (ex.: calcular `likedByMe`).
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return true;
    }

    try {
      request['user'] = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtConstants.secret,
      });
    } catch {
      // Token inválido/expirado: tratamos como visitante.
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
