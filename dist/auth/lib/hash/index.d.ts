export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (enteredPassword: string, targetPassword: string) => Promise<boolean>;
