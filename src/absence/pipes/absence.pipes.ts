/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { MissingCredentialsException } from 'src/exceptions/entity.exceptions';

export class ValidateAbsenceCredentialsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.date) {
      throw new MissingCredentialsException('Date are required');
    }
    return value;
  }
}
