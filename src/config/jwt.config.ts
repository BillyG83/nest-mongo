import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    accessTokenTtl: Number(process.env.JWT_ACCESS_TOKEN_TTL) || 3600,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    secret: process.env.JWT_SECRET,
  };
});
