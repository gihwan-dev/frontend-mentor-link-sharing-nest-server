/// <reference types="qs" />
/// <reference types="express" />
import { Repository } from 'typeorm';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    uploadToS3: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    private readonly uploadPath;
    constructor(userRepository: Repository<Users>);
    findOne(email: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        image: string;
    }>;
    findOneUser(id: number): Promise<Users>;
    upload(req: any, res: any, email: string): Promise<void>;
    updateOne(updateUserDto: UpdateUserDto, jwt: any): Promise<{
        message: string;
    }>;
    create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto>;
    getImage(email: string): Promise<string>;
    getImagePublic(id: string): Promise<string>;
}
