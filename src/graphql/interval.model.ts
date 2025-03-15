import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Interval {
  @Field({ nullable: true })
  secs: string;

  @Field({ nullable: true })
  mins: string;

  @Field({ nullable: true })
  hours: string;

  @Field({ nullable: true })
  days: string;
}
