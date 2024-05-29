/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import {
  MissingCredentialsException,
  NotFoundException,
} from '../../exceptions/entity.exceptions';

export class ValidateMonitorCredentialsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      !value.registration ||
      !value.registration === undefined ||
      !value.name ||
      !value.name === undefined ||
      !value.institutionalEmail ||
      !value.institutionalEmail === undefined ||
      !value.typeOfMonitoring ||
      !value.typeOfMonitoring === undefined ||
      !value.daysOfTheWeek ||
      !value.daysOfTheWeek === undefined ||
      !value.startHour ||
      !value.startHour === undefined ||
      !value.endHour ||
      !value.endHour === undefined
    ) {
      throw new MissingCredentialsException(
        'Registration, name, institutionalEmail, typeOfMonitoring, daysOfTheWeek, startHour and endHour are requireds',
      );
    } else if (!value.usersId || value.usersId === undefined) {
      throw new NotFoundException('No users found');
    } else if (!value.matterId || value.matterId === undefined) {
      throw new NotFoundException('No matter found');
    }
    return value;
  }
}
