import { getRepository, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../../infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';

class UsersRepository implements IUsersRepository {
  private usersRepository: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.usersRepository.find(user => user.id === id);
    return findUser;
  }
  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.usersRepository.find(user => user.email === email);
    return findUser;
  }
  public async save(user: User): Promise<User> {
    const findIndex = this.usersRepository.findIndex(
      findUser => findUser.id === user.id,
    );

    this.usersRepository[findIndex] = user;

    return user;
  }
  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, userData);
    this.usersRepository.push(user);
    return user;
  }
}

export default UsersRepository;
