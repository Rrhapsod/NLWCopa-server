import "dotenv/config.js";

function loadEnvironmentVariable(keyname: any) {
  const envVar = process.env[keyname];

  if (!envVar) {
    throw new Error(`Configuration must include ${keyname}`);
  }

  return envVar;
}

export const secretKey = loadEnvironmentVariable("SECRET");
