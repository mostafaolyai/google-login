import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { getJwtMiddleware } from './auth/middlewares/jwt-middleware';
import { GoogleAuthenticationService } from './auth/strategy/google.service';
import { UserService } from './user-service/user.service';

require('./common/plugins/mongoose.plugin');
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(getJwtMiddleware(app.get(AuthService), app.get(UserService), app.get(GoogleAuthenticationService)));

    await app.listen(4000);
}
bootstrap();
