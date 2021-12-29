import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import * as auth from 'basic-auth';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { name, pass } = auth(request);
    const username = process.env.AUTH_USERNAME;
    const password = process.env.AUTH_PASSWORD;

    if(username == name && password == pass) {
      return true;
    }

    return false;
  }
}