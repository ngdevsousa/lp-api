/* eslint-disable */
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (
      value instanceof Object &&
      this.isEmpty(value) &&
      metadata.type !== 'query'
    ) {
      throw new HttpException(
        'invalid param: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        `invalid param: ${this.format(errors)}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private format(errors: any[]) {
    return errors
      .map((err) => {
        if (err.children.length > 0) {
          return err.children
            .map((children) => {
              for (const prop in children.constraints) {
                return children.constraints[prop];
              }
            })
            .join(', ');
        } else {
          for (const prop in err.constraints) {
            return err.constraints[prop];
          }
        }
      })
      .join(', ');
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }

    return true;
  }
}
