// @ts-check

import { randomBytes } from 'crypto';

const secret = randomBytes(64).toString('hex');

console.info(secret)