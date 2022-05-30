import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from '../decorator/meta-data/is-public';
import { ROLE } from '../decorator/meta-data/needs-permission';
import { Identity } from '../models/identity';
import { RoleType } from '../../common/type/role-type';
import { AuthorizerBase } from './abstract/authorizer-base';

@Injectable()
export class MainAuthorizer extends AuthorizerBase {
    constructor() {
        super();
    }

    private reflect<T>(context: ExecutionContext, reflector: Reflector, metaKey: string): T {
        return reflector.getAllAndOverride<T>(metaKey, [context.getHandler(), context.getClass()]);
    }

    // forbidden() {
    //     throw new ForbiddenException("You don't have access.");
    // }

    async canAccess(context: ExecutionContext, reflector: Reflector): Promise<boolean> {
        const { identity } = this.getContextData(context);

        //IS PUBLIC .....................
        const isApiPublic = this.reflect<boolean>(context, reflector, IS_PUBLIC);
        if (isApiPublic) {
            return true;
        }

        // all Apis need to login expect is public Apis ........
        if (!identity || identity.isAuthenticated === false) {
            throw new UnauthorizedException("You're not login!");
        }

        // NEEDS PERMISSION .................
        const config = this.reflect<RoleType[]>(context, reflector, ROLE);
        if (config) {
            const user = identity.user;

            if (!config.includes(user.role)) return false;
        }

        return true;
    }

    // noinspection JSMethodCanBeStatic
    private getContextData(context: ExecutionContext): { identity: Identity; request: any } {
        const request = context.switchToHttp().getRequest();
        return {
            identity: request['identity'] as Identity,
            request: request,
        };
    }
}
