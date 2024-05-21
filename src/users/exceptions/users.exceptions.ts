import { HttpException, HttpStatus } from '@nestjs/common';

export class MissingCredentialsException extends HttpException {
  constructor() {
    super('Name, login and password are required', HttpStatus.BAD_REQUEST);
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(
      'User with the same login and password already exists',
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidUserRoleException extends HttpException {
  constructor() {
    super(
      'Invalid role value. Allowed value: "PROFESSOR" or "ALUNO"',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class NoUsersFoundException extends HttpException {
  constructor() {
    super('No users found', HttpStatus.NOT_FOUND);
  }
}
