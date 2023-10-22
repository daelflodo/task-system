import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'daelflodo',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

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

  @ApiProperty({
    example: 'Admin',
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}
export class UpdateAuthDto extends PartialType(RegisterAuthDto) {
  @IsJWT()
  @IsOptional()
  readonly token?: string;
}
