import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto) {
try {
  const { email, password, userName } = registerAuthDto;
  const userFound = await this.prisma.user.findFirst({
    where: {
      OR: [{ email }, { userName }],
    },
  });
  if (userFound)
    throw new ConflictException(
      'A user already exists with that email or username',
    );
  const hashedPassword = await hash(password, +process.env.HASH_SALT);
  registerAuthDto.password = hashedPassword;
  const createUser = await this.prisma.user.create({ data: registerAuthDto });
  delete createUser.password;
  return {
    message: 'User Created Successfully',
    data: createUser,
  };
} catch (error) {
  return error.message
}
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const { email, password } = loginAuthDto;
      const userFound = await this.prisma.user.findFirst({
        where: { email },
      });
      if (!userFound) throw new NotFoundException('User not found');

      const isPasswordValid = await compare(password, userFound.password);
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid credentials');
      const payload = { id: userFound.id, name: userFound.userName, role: userFound.role };
      const token = this.jwtService.sign(payload);
      userFound.token = token;
      const createToken = await this.prisma.user.update({
        where: { id: userFound.id },
        data: userFound,
      });
      delete createToken.password;
      return createToken;
    } catch (error) {
      return error.message;
    }
  }
  async findAll() {
    try {
      const allUser = await this.prisma.user.findMany({
        include: {
          tasks: {
            select: {
              title: true,
              createdAt: true,
              dueBy: true,
            },
          },
        },
      });
      if (!allUser) throw new NotFoundException('There are no users');
      const filteredUser = allUser.map((user) => {
        const { password, token, ...filteredUser } = user;
        return filteredUser;
      });
      return filteredUser;
    } catch (error) {
      return error.message;
    }
  }
}
