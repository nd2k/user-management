import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

/**
 * Validate Resource is a middleware which is validating the resources sent by the client
 * @param schema - validation schema
 * @returns next middleware or bad request status code
 */
const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      return res.status(400).send(e.errors);
    }
  };

export default validateResource;
