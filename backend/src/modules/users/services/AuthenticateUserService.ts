import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IReponse {
  user: User;
  token: string;
}

const INCORRET_COMBINATION_ERROR_MESSAGE =
  'Incorrect email/password combinantion';

@injectable()
class AuthenticateUserService {
  /**
   *
   */

  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}
  public async execute({ email, password }: IRequest): Promise<IReponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(INCORRET_COMBINATION_ERROR_MESSAGE);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError(INCORRET_COMBINATION_ERROR_MESSAGE);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ name: user.name }, secret, {
      subject: user.id,
      expiresIn,
    });
    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
