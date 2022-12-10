import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDTO {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    name?: string;
}

export class ResetPasswordDTO {

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmpassword: string;
}