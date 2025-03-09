import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { RegisterUserDto } from './Dtos/register-user.dto';
import { VerifyUserDto } from './Dtos/verify-user.dto';
import { Token } from './graphql/token.model';
import { LoginUserDto } from './Dtos/login-user.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Query(() => String)
  sayHello(): string {
    return 'Hello, world!';
  }

  @Mutation((returns) => User)
  registerUser(@Args('userData') registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Mutation((returns) => User)
  verifyUserEmail(@Args('optData') verifyUserDto: VerifyUserDto) {
    return this.authService.verifyUser(verifyUserDto);
  }

  @Mutation((returns) => Token)
  loginUser(@Args('credentials') loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }
}
