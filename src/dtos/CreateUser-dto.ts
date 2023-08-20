import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: 'Campo "name" é obrigatório.' })
  name!: string;

  @IsEmail({}, { message: "Formato do E-mail incorreto." })
  @IsNotEmpty({ message: 'Campo "email" é obrigatório.' })
  email!: string;

  @IsNotEmpty({ message: 'Campo "password" é obrigatório.' })
  @Length(6, undefined, {
    message: "A senha deve ter no mínimo 6 caracteres.",
  })
  password!: string;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }
}
