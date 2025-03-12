import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

@InputType()
export class CreateStaffRoleDto {
  @IsString()
  @Length(3, 50)
  @Transform(({ value }) => value.trim())
  @Field()
  name: string;
}
