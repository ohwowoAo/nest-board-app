import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./user.entity";

export const GetUser = createParamDecorator((data, ctx : ExecutionContext) : User => {
  const request = ctx.switchToHttp().getRequest();
  console.log('request', request);
  return request.user;
});