import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindProviderDTO from '../dtos/IFindAllProvidersDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUserRepository {
  findAllProviders(data: IFindProviderDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;

  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
