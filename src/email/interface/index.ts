export interface UserInterface {
    email: string,
    password: string,
    name?: string,
    isVerified?: boolean
}

export interface VerificationInterface {
    user: string,
    verificationID: string
}

export interface ForgotInterface {
    user: string,
    forgotID: string
}

export interface ResetPassword {
    forgotID: string,
    password: string,
    confirmpassword: string
}