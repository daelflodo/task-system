import { IsString, IsUrl, IsNotEmpty, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example:'Salir a correr',
    description: 'debe de ser un string y no debe de estar vacio',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: '16/10/2023',
    description: 'debe de ser un string y no debe de estar vacio',
  })
  @IsString()
  @IsNotEmpty()
  dueBy: Date;

  @ApiProperty({
    example: '9a85e2dc-b182-4fe6-a94c-8e42d12d5142',
    description: 'debe de ser un uuid y no debe de estar vacio',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
