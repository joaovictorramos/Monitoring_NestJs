import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidClassroomRoleException extends HttpException {
  constructor() {
    super(
      'Invalid role value. Allowed value: "SALA", "LABORATÓRIO" or "AUDITÓRIO"',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class NoClassroomFoundException extends HttpException {
  constructor() {
    super('No classroom found', HttpStatus.NOT_FOUND);
  }
}
