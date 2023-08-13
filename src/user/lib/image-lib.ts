import * as path from 'path';
import * as url from 'url';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import axios from 'axios';

export const saveImageHandler = async (username: string, imageUrl: string) => {
  const fileExtension = path
    .extname(url.parse(imageUrl).pathname)
    .toLowerCase();

  if (
    fileExtension !== '.png' &&
    fileExtension !== '.jpg' &&
    fileExtension !== '.jpeg'
  ) {
    throw new BadRequestException(
      'JPG 또는 PNG 파일의 형식으로 이미지를 설정해 주세요.',
    );
  }

  const response = await axios.get(imageUrl, {
    responseType: 'stream',
  });

  const contentType = response.headers['content-type'];
  if (!['image/png', 'image/jpeg'].includes(contentType)) {
    throw new BadRequestException(
      'JPG 또는 PNG 파일의 형식으로 이미지를 설정해 주세요.',
    );
  }

  const outputPath = path.join(
    __dirname,
    'images',
    username.trim() + fileExtension,
  );

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  const saveImageResult = new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
  if (!saveImageResult) {
    throw new BadRequestException(
      '이미지를 저장하는데 실패했습니다. 다시시도해 주세요.',
    );
  }
};
