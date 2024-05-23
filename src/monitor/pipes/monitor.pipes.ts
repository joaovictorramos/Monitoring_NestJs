/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { MissingMonitorCredentialsException } from '../exceptions/monitor.exceptions';
import { NoUsersFoundException } from 'src/users/exceptions/users.exceptions';

export class ValidateMonitorCredentialsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.registration || !value.name || !value.institutionalEmail) {
      throw new MissingMonitorCredentialsException();
    }
    return value;
  }
}
