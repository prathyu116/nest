import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly roles: string[], private readonly permissions: string[]) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
      
        if (req.user.roles && this.roles) {
            if (!this.roles.some((role: string) => req.user.roles.includes(role))) {
                throw new UnauthorizedException('You are not authorized to perform this operation');

            }
        }
        if (req.user.permissions && this.permissions) {
            if (!this.permissions.some((perm: string) => req.user.permissions.includes(perm))) {
                throw new UnauthorizedException('You are not authorized to perform this operation');

            }
        }
        return true;
    }
}
