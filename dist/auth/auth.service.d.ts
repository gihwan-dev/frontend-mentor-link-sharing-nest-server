import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FindOneAuthDto, UpdateAuthResponseDto } from './dto/findOne-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../user/entities/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private jwtService;
    constructor(userRepository: Repository<Users>, jwtService: JwtService);
    getProfile({ email }: {
        email: string;
    }): Promise<{
        statusCode: HttpStatus;
        message: string;
        id?: undefined;
    } | {
        statusCode: HttpStatus;
        id: number;
        message?: undefined;
    } | {
        statusCode: HttpStatus;
        message?: undefined;
        id?: undefined;
    }>;
    signIn(findOneAuthDto: FindOneAuthDto): Promise<UpdateAuthResponseDto>;
}
