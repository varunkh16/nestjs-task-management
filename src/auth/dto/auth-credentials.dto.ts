import { IsNotEmpty, Min, IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    //@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
}