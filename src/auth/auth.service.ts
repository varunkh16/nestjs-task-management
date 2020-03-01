import { Injectable, NotFoundException, NotAcceptableException, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.interface';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JWTPayload } from './jwt-payload.interface';


@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>, private jwtService: JwtService) {}

    async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<any> {
        const {username, password} = authCredentialsDTO;
    
        const user = new this.userModel();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (err) {
            if (err.code === 11000) {
                throw new BadRequestException(`Username "${username}" already exists`);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
        const {username, password} = authCredentialsDTO;

        await this.validateUsernamePassword(authCredentialsDTO);

        const payload: JWTPayload = { username };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }

    private async validateUsernamePassword(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        const {username, password} = authCredentialsDTO;

        const found = await this.userModel.findOne({username}).exec();

        if (!found) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        if (!(found.password === await this.hashPassword(password, found.salt))) {
            throw new UnauthorizedException("Invalid Credentials");
        }
    }
}
