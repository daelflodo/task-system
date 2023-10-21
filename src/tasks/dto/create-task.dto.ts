import { IsString, IsUrl, IsNotEmpty,IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'debe de ser un strnig y no debe de estar vacio',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: '16/10/2023',
    description: 'debe de ser un strnig y no debe de estar vacio',
  })
  @IsString()
  @IsNotEmpty()
  readonly dueBy: Date;
}
