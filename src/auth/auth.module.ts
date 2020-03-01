import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWTStratergy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
    secret: 'topsecret51',
    signOptions: {
      expiresIn: 3600,
    },
  }),
  MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
  controllers: [AuthController],
  providers: [AuthService, JWTStratergy],
  exports: [JWTStratergy, PassportModule],
})
export class AuthModule {}
