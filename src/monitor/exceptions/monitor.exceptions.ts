import { HttpException, HttpStatus } from '@nestjs/common';

export class MissingMonitorCredentialsException extends HttpException {
  constructor() {
    super(
      'Registration, name and institutional email are required',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class MonitorAlreadyExistsException extends HttpException {
  constructor() {
    super(
      'Monitor with the same registration or institutional email already exists',
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidMonitorRoleException extends HttpException {
  constructor(description: string) {
    super(description, HttpStatus.BAD_REQUEST);
  }
}
