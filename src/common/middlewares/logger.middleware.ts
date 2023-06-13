import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';

const SPACE = 2;
const NL = '\n';

export function LoggerMiddleware() {
  return function (req: Request, res: Response, next: Function) {
    res.locals.__startTime = new Date().getTime();

    res.end = new Proxy(res.end, {
      apply: function (end, thisArg: Response, args: any) {
        const responseTime = (new Date().getTime() -
          res.locals.__startTime) as number;

        end.apply(thisArg, args);

        const url = req.originalUrl || req.url;

        const context = {
          headers: req.headers,
          body: undefined,
          error: undefined,
        };

        const message = `${res.statusCode} ${
          req.method
        } ${url} ${responseTime}ms ${format(context)}`;

        if (res.statusCode >= 400) {
          Logger.warn(message, 'HTTP');
        } else {
          Logger.log(message, 'HTTP');
        }
      },
    });

    next();
  };
}

function format(input: any, addNewLine?: boolean): string {
  if (input instanceof Error) {
    return (addNewLine ? NL : '') + input.stack.replace(/\n/g, NL);
  } else if (input) {
    return (addNewLine ? NL : '') + JSON.stringify(input, null, SPACE);
  } else {
    return '';
  }
}
