/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { MissingCredentialsException } from 'src/exceptions/entity.exceptions';

export class ValidateClassroomCredentialsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      !value.name ||
      value.name === undefined ||
      !value.type ||
      value.type === undefined ||
      value.isReserved === undefined
    ) {
      throw new MissingCredentialsException(
        'Name, type and isReserved are requireds',
      );
    }
    return value;
  }
}
