/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import {
  MissingCredentialsException,
  NotFoundException,
} from 'src/exceptions/entity.exceptions';

export class ValidateAbsenceCredentialsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.date || value === undefined) {
      throw new MissingCredentialsException('Date are required');
    } else if (!value.monitorId || value === undefined) {
      throw new NotFoundException('No monitor found');
    }
    return value;
  }
}
