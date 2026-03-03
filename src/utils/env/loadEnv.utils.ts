import dotenv from 'dotenv'

//config() synchronous function will read .env file, parse the contents, assign content to process.env
export function loadEnv() {
  // load default env in case there are shared defaults
  dotenv.config({ path: '.env' })
  // logical operator ?? if left side operand is null or underfined, returns right side operand
  // if we do not pass env name be default it is sandbox
  const env = process.env.ENV ?? 'sandbox'
  // overwrite values that differs
  dotenv.config({ path: `.env.${env}`, override: true })
}
