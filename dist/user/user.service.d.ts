/// <reference types="multer" />
import { Repository } from 'typeorm';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    private readonly uploadPath;
    constructor(userRepository: Repository<Users>);
    findOne(email: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
    }>;
    upload(file: Express.Multer.File, email: string): Promise<{
        message: string;
    }>;
    updateOne(updateUserDto: UpdateUserDto, jwt: any): Promise<{
        message: string;
    }>;
    create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto>;
    getImage(email: string): Promise<string>;
    getImagePublic(id: string): Promise<string>;
}
