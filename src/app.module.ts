import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizerBase } from './auth/guards/abstract/authorizer-base';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { MainAuthorizer } from './auth/guards/main-authorizer';
import { UserModule } from './user-service/user.module';

//.env config
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://${process.env.mongo_server}/`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ignoreUndefined: true,
            user: process.env.mongo_user,
            pass: process.env.mongo_pass,
            dbName: process.env.mongo_database,
        }),
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,

        // make sure all APIs are only accessed by logged-in users
        // unless you specify otherwise, with {@link Public} decorator
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        // Application authorizer
        {
            provide: AuthorizerBase,
            useClass: MainAuthorizer,
        },
    ],
})
export class AppModule {}
