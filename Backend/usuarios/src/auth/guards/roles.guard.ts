// En: src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtenemos los roles permitidos para esta ruta desde el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene un decorador @Roles, la dejamos pasar (es pública)
    if (!requiredRoles) {
      return true;
    }

    // Obtenemos el usuario del request (que fue añadido por el JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();
    
    // Si no hay usuario, denegamos el acceso
    if (!user || !user.rol) {
        return false;
    }

    // Comprobamos si el rol del usuario está en la lista de roles permitidos
    return requiredRoles.some((role) => user.rol.includes(role));
  }
}