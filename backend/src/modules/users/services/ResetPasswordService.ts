import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { addHours, differenceInHours, isAfter } from 'date-fns';

import IUserRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProviders/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User token does not exists');
    }
    const user = await this.usersRepository.findById(userToken?.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCratedAt = userToken.created_at;
    const compareDate = addHours(tokenCratedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('token expired');
    }
    user.password = password;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
