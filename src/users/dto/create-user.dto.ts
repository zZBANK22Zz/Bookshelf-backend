export class CreateUserDto {
    email: string;
    name: string;
    password: string;
    role?: 'USER' | 'ADMIN';
}
