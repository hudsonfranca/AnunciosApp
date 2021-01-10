import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { keys } from '../keys';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: keys.pgHost,
  port: parseInt(keys.pgPort),
  username: keys.pgUser,
  password: keys.pgPassword,
  database: keys.pgDatabase,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
