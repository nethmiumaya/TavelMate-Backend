import { v4 as uuidv4 } from 'uuid';

export const generateSharedLink = () => {
    return uuidv4(); // Return just the UUID for URL param
};