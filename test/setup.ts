import * as dotenv from 'dotenv';
import * as path from 'path';

const init_config = () => {
    dotenv.config({ path: path.resolve("env", "default.env") });
    dotenv.config({ path: path.resolve("env", `./test.env`) });
}

init_config()