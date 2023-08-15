import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Name is required." })
  name!: string;

  @IsEmail({}, { message: "Invalid email format." })
  @IsNotEmpty({ message: "Email is required." })
  email!: string;

  @IsNotEmpty({ message: "Password is required." })
  @Length(6, undefined, {
    message: "Password should have a minimum length of 6 characters.",
  })
  password!: string;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
