import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';
import { parse } from 'date-fns';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  async create(createTaskDto: CreateTaskDto) {
    try {
      const taskFound = await this.prisma.task.findFirst({
        where: {
          title: createTaskDto.title,
          user: { id: createTaskDto.userId },
        },
      });
      // if (!taskFound) throw new NotFoundException('userId not found');
      if (taskFound) throw new ConflictException('The task already exists');
      const dueBy = createTaskDto.dueBy.toString();
      const formattedDate = parse(dueBy, 'dd/MM/yyyy', new Date());
      createTaskDto.dueBy = formattedDate;

      const createTask = await this.prisma.task.create({ data: createTaskDto });

      return {
        message: 'The task was created correctly',
        data: createTask,
      };
    } catch (error) {
      return error.message;
    }
  }

  async findAll() {
    try {
      const tasksFound = await this.prisma.task.findMany();
      if (!tasksFound) throw new NotFoundException('There are no tasks');
      return tasksFound;
    } catch (error) {
      return error.message;
    }
  }

  async findOne(id: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Input syntax is not valid for type uuid');
    }
    const taskFound = await this.prisma.task.findFirst({
      where: { id },
    });
    if (!taskFound) throw new NotFoundException('The task was not found');
    return taskFound;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Input syntax is not valid for type uuid');
    }
    const taskFound = await this.prisma.task.findFirst({
      where: { id },
      include: { user: true },
    });
    if (!taskFound)
      throw new NotFoundException('The task to update was not found');

    if (!updateTaskDto.dueBy && !updateTaskDto.title)
      throw new BadRequestException('At least one value is expected to update');

    if (taskFound.user.id !== updateTaskDto.userId)
      throw new UnauthorizedException('You can only modify your tasks');

    const dueBy = updateTaskDto.dueBy.toString();
    const formattedDate = parse(dueBy, 'dd/MM/yyyy', new Date());
    updateTaskDto.dueBy = formattedDate;

    const taskUpdate = await this.prisma.task.update({
      data: updateTaskDto,
      where: { id },
    });
    return {
      message: 'The task was updated',
      data: taskUpdate,
    };
  }

  async remove(id: string, userId: string) {
    try {
      const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException(
        'Input id syntax is not valid for type uuid',
      );
    }

    if (!userId) throw new NotFoundException('Enter userId');
    if (!uuidRegex.test(userId)) {
      throw new BadRequestException(
        'Input uuid syntax is not valid for type uuid',
      );
    }
    const taskFound = await this.prisma.task.findFirst({
      where: { id },
      include: { user: true },
    });
    if (!taskFound) throw new NotFoundException('Task to delete not found');
    if (taskFound.user.id !== userId)
      throw new UnauthorizedException('You can only delete your tasks');
    const taskDelete = await this.prisma.task.delete({ where: { id } });
    return {
      message: 'The task has been deleted',
      data: taskDelete,
    };
    } catch (error) {
      return error.message
    }
  }
}
