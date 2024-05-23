import { HttpException, HttpStatus } from '@nestjs/common';

export class MissingCredentialsException extends HttpException {
  constructor(description: string) {
    super(description, HttpStatus.BAD_REQUEST);
  }
}

export class AlreadyExistsException extends HttpException {
  constructor(description: string) {
    super(description, HttpStatus.CONFLICT);
  }
}

export class InvalidRoleException extends HttpException {
  constructor(description: string) {
    super(description, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundException extends HttpException {
  constructor(description: string) {
    super(description, HttpStatus.NOT_FOUND);
  }
}
