type Environment = {
  APP: string;
  JWT_SECRET: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_CONNECTOR: string;
};

export const environment: Environment = {
  APP: process.env.JWT_SECRET as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_DATABASE: process.env.DB_DATABASE as string,
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: +process.env.DB_PORT,
  DB_CONNECTOR: process.env.DB_CONNECTOR as string,
};
