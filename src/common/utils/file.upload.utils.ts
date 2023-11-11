import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';

export const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  const randomName = Array(22)
    .fill(0)
    .map(() => Math.round(Math.random() * 10).toString())
    .join('');
  callback(null, `${randomName}${fileExtName}`);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|png|jpeg|img)$/)) {
    return callback(
      new HttpException('Only image allowed', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};
