import * as dotenv from 'dotenv';
import * as path from 'path';

export const init_config = () => {
    dotenv.config({ path: path.resolve("env", "default.env") });
    if (process.env.STAGE) {
        dotenv.config({ path: path.resolve("env", `./${process.env.STAGE}.env`) });
    }
}