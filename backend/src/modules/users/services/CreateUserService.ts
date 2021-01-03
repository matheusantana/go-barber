import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import IHashProvider from '../providers/HashProviders/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const chekcUserExists = await this.usersRepository.findByEmail(email);

    if (chekcUserExists) {
      throw new AppError('Email address already used.');
    }
    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
