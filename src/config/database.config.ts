import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    autoload: Boolean(process.env.DATABASE_AUTOLOAD === 'true'),
    host: process.env.DATABASE_HOST || 'localhost',
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT) || 5432,
    sync: Boolean(process.env.DATABASE_SYNCHRONIZE === 'true'),
    user: process.env.DATABASE_USER,
  };
});
