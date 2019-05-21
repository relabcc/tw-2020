import config from '../../../gatsby-config';

const BASE_URI = `/${config.pathPrefix}`;
const BASE_URI_LOCAL = 'http://localhost:8000'

const forceRemote = 0;
const BASE = process.env.NODE_ENV === 'production' || forceRemote ? BASE_URI : BASE_URI_LOCAL;

export const API_BASE = BASE;
