import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtener el usuario del request (debe ser seteado por JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || !user.rol) {
      throw new ForbiddenException('No autorizado - Usuario no autenticado');
    }

    // Verificar si el rol del usuario está entre los roles requeridos
    const hasRole = requiredRoles.includes(user.rol);
    
    if (!hasRole) {
      throw new ForbiddenException(`Acceso denegado. Se requiere rol: ${requiredRoles.join(', ')}`);
    }
    
    return true;
  }
}