import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY, ROLES } from '../../config';
import { CreateUserDto, LoginUserDto } from '../dtos';
import { UserRepository, RoleRepository } from '../../data/repositories';
import { HttpException } from '../exceptions';
import { DataStoredInToken, TokenData, User, Role } from '../../interfaces';
import { isEmpty, isNull } from 'underscore';

export class AuthService {
  public userRepository = UserRepository;
  public roleRepository = RoleRepository;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isNull(userData)) throw new HttpException(400, 'Some of the user data fields are missing');
    if (isEmpty(userData?.name)) throw new HttpException(409, 'The name field is missing');
    if (isEmpty(userData?.email)) throw new HttpException(409, 'The email field is missing');
    if (isEmpty(userData?.password)) throw new HttpException(409, 'The password field is missing');

    const foundUser: User = await this.userRepository.findOne({ where: { name: userData.name, email: userData.email } });
    if (foundUser) throw new HttpException(409, `The email ${userData.email} already exists`);

    const foundRole: Role = await this.roleRepository.findOne({ where: { name: ROLES.STAFF_USER.name } });

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.userRepository.create({ ...userData, password: hashedPassword, role: foundRole }).save();
    return createUserData;
  }

  public async login(userData: LoginUserDto): Promise<{ tokenData: TokenData; user: User }> {
    if (isNull(userData)) throw new HttpException(400, 'Some of the user data fields are missing');
    if (isEmpty(userData?.email)) throw new HttpException(409, 'The email field is missing');
    if (isEmpty(userData?.password)) throw new HttpException(409, 'The password field is missing');

    const foundUser: User = await this.userRepository.findOne({ where: { email: userData.email } });
    if (!foundUser) throw new HttpException(409, `Your email ${userData.email} has not been found in our system`);

    const isPasswordMatching: boolean = await compare(userData.password, foundUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Your password is incorrect');

    const tokenData = this.createToken(foundUser);
    return { tokenData, user: foundUser };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id, name: user.name };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}
