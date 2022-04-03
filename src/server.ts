import config from './config/config';
import express, { Request, Response } from 'express';

const PORT: number = config.PORT;
const TEST: string = config.TEST;

const server = express();
server.use(express.json());

server.get('/', (req: Request, res: Response) => {
  return res.send({ connectivityTest: 'OK', test: TEST }).status(200);
});

server.listen(PORT, () => {
  console.log(`Server is running on port -- http://localhost:${PORT}`);
});
