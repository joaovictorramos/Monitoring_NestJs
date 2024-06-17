/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { MissingCredentialsException } from 'src/exceptions/entity.exceptions';

export class ValidateDaysOfTheWeekCredentialsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.daysWeek || value === undefined) {
      throw new MissingCredentialsException('DaysWeek are required');
    }
    switch (value.daysWeek) {
      case value.daysWeek == 'DOMINGO':
      case value.daysWeek == 'SEGUNDA-FEIRA':
      case value.daysWeek == 'TERÇA-FEIRA':
      case value.daysWeek == 'QUARTA-FEIRA':
      case value.daysWeek == 'QUINTA-FEIRA':
      case value.daysWeek == 'SEXTA-FEIRA':
      case value.daysWeek == 'SÁBADO':
        throw new MissingCredentialsException(
          'DaysWeek must be "DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA" or "SÁBADO".',
        );
    }
    return value;
  }
}
