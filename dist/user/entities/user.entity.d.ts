import { Platforms } from '../../platform/entities/platform.entity';
export declare class Users {
    id: number;
    username: string;
    email: string;
    password: string;
    contactEmail: string;
    platforms: Platforms[];
}
