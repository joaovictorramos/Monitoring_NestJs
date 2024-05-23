/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import {
  MissingCredentialsException,
  NotFoundException,
} from '../../exceptions/entity.exceptions';

export class ValidateMonitorCredentialsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.registration || !value.name || !value.institutionalEmail) {
      throw new MissingCredentialsException(
        'Registration, name and institutional email are required',
      );
    } else if (!value.usersId) {
      throw new NotFoundException('No users found');
    }
    return value;
  }
}
