import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'dael@gmail.com',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '@Asd1234',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
export class UpdateAuthDto extends PartialType(LoginAuthDto) {}
