import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPayload } from './jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.interface';

@Injectable()
export class JWTStratergy extends PassportStrategy(Strategy) {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'topsecret51',
        });
    }

    async validate(payload: JWTPayload): Promise<User> {
        const { username } = payload;
        const user = await this.userModel.findOne({username}).exec();

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}