import { AuthService } from './auth.service';
import { Response } from 'express';
import { FindOneAuthDto } from './dto/findOne-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getProfile(req: any, res: Response): Promise<void | Response<any, Record<string, any>>>;
    signIn(findOneAuthDto: FindOneAuthDto, response: Response): Promise<Response<any, Record<string, any>>>;
}
