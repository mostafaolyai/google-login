import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface';
import { AuthorizerBase } from './abstract/authorizer-base';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private readonly authorizerBase: AuthorizerBase) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return await this.authorizerBase.canAccess(context, this.reflector);
    }
}
