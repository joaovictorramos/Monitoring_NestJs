import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: '7c82b7f50f678fe051ea4b7dbb8d6e5e',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
