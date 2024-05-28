/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { MissingCredentialsException } from 'src/exceptions/entity.exceptions';

export class ValidateMatterCredentialsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      !value.name ||
      value.name === undefined ||
      !value.teacher ||
      value.teacher === undefined ||
      !value.type ||
      value.type === undefined ||
      !value.startHour ||
      value.startHour === undefined ||
      !value.endHour ||
      value.endHour === undefined ||
      !value.daysOfTheWeek ||
      value.daysOfTheWeek === undefined
    ) {
      throw new MissingCredentialsException(
        'Name, teacher, type, startHour, endHour and daysOfTheWeek are required',
      );
    }
    return value;
  }
}
