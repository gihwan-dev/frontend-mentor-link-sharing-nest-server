import { UserService } from './user.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findOne(req: any): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        image: string;
    }>;
    create(createUserDto: CreateUserDto, response: Response): Promise<Response<any, Record<string, any>>>;
    updateOne(updateUserDto: UpdateUserDto, req: any): Promise<{
        message: string;
    }>;
    upload(req: any, res: any): Promise<void>;
    getImage(req: any, res: Response): Promise<void>;
    getImagePublic(param: any, res: Response): Promise<void>;
}
