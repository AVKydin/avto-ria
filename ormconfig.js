// eslint-disable-next-line @typescript-eslint/no-var-requires
const typeorm = require('typeorm');

const dataSource = new typeorm.DataSource({
  name: 'default',
  type: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'user',
  password: 'pass',
  database: 'auto-ria',
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: 'migrations',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.ts'],
});

module.exports = [dataSource];
