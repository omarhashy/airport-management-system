import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsInt, IsString, Length } from 'class-validator';

@InputType()
export class UpdateStaffRoleDto {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsString()
  @Length(3, 50)
  @Transform(({ value }) => value.trim())
  @Field()
  name: string;
}
