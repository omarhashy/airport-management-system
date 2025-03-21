import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { RegisterUserDto } from './Dtos/register-user.dto';
import { VerifyUserEmailDto } from './Dtos/verify-user-email.dto';
import { Token } from '../graphql/token.model';
import { LoginUserDto } from './Dtos/login-user.dto';
import { Message } from '../graphql/mesage.model';
import { ResetUserPasswordDto } from './Dtos/reset-user-password.dto';
import { VerifyResetUserPasswordDto } from './Dtos/verify-reset-user-password.dto';
import { ResendOtpDto } from './Dtos/resend-otp.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((returns) => User)
  seedAdmin() {
    return this.authService.seedSuperAdmin();
  }
  @Mutation((returns) => User)
  registerUser(@Args('userData') registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Mutation((returns) => User)
  verifyUserEmail(@Args('otpData') verifyDto: VerifyUserEmailDto) {
    return this.authService.verifyUserEmail(verifyDto);
  }

  @Mutation((returns) => Token)
  loginUser(@Args('credentials') loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Mutation((returns) => Message)
  resetUserPassword(
    @Args('userData') resetUserPasswordDto: ResetUserPasswordDto,
  ) {
    return this.authService.resetUserPassword(resetUserPasswordDto);
  }

  @Mutation((returns) => Message)
  verifyResetUserPassword(
    @Args('credentials') verifyResetUserPasswordDto: VerifyResetUserPasswordDto,
  ) {
    return this.authService.verifyRestUserPassword(verifyResetUserPasswordDto);
  }

  @Mutation((returns) => Message)
  resendOtp(@Args('userData') resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }
}
