import { Dialect, Sequelize } from 'sequelize';
import {environment} from '../../environment/environments'; // for serverless api

const sequelize = new Sequelize(
  environment.DB_DATABASE,
  environment.DB_USER,
  environment.DB_PASSWORD,
  {
    host: environment.DB_HOST,
    dialect: environment.DB_CONNECTOR as Dialect,
    logging: true
  }
);

if (process.env.NODE_ENV !== 'test') {
  sequelize.sync();
}

export default sequelize;
