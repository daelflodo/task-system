import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiProperty({
        example: '9a85e2dc-b182-4fe6-a94c-8e42d12d5142',
        description: 'debe de ser un uuid y no debe de estar vacio',
      })
      @IsString()
      @IsNotEmpty()
      userId: string;
}
