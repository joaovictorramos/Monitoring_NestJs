/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { MissingCredentialsException } from '../exceptions/users.exceptions';

@Injectable()
export class ValidateCredentialsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.login || !value.password || !value.name) {
      throw new MissingCredentialsException();
    }
    return value;
  }
}
