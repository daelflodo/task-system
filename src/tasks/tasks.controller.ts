import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/enums/rol.enum';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @ApiBearerAuth()
  @Auth(Role.ADMIN && Role.USER)
  // @Auth(Role.USER)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @ApiBearerAuth()
  @Auth(Role.ADMIN && Role.USER)
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @ApiBearerAuth()
  @Auth(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Body('userId') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
