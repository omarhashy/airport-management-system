import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Interval {
  @Field({ defaultValue: '0' })
  seconds: string;

  @Field({ defaultValue: '0' })
  minutes: string;

  @Field({ defaultValue: '0' })
  hours: string;

  @Field({ defaultValue: '0' })
  days: string;
}
