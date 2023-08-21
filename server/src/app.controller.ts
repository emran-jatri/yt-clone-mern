import {
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { createReadStream, readdirSync, statSync } from 'fs';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { extname, join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Headers() headers, @Req() req: Request): object {
    const { protocol } = req;
    const { host } = headers;
    const fileList = readdirSync('./uploads').filter(
      (fileName) => extname(fileName) === '.mp4',
    );
    const videoList = [];

    fileList.length &&
      fileList.forEach((name, index) => {
        const url = protocol + '://' + host + '/' + name;
        const videoPath = join(process.cwd(), 'uploads', name);
        const fileSize = statSync(videoPath).size;
        videoList.push({
          id: index + 1,
          videoUrl: url,
          size: fileSize,
          isHovered: false,
        });
      });
    return videoList;
    // return this.appService.getHello();
  }

  @Post('/upload-video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadVideo(@UploadedFile() file: Express.Multer.File): string {
    console.log(file);
    return this.appService.uploadVideo();
  }

  @Get('/get-file')
  getFile(
    @Res({ passthrough: true }) res: Response,
    @Query() query: { fileName: string },
    @Headers() headers,
    @Req() req: Request,
  ) {
    // console.log(
    //   '🚀 ~ file: app.controller.ts:58 ~ AppController ~ req:',
    //   req.url,
    //   req.baseUrl,
    //   req.originalUrl,
    //   req.hostname,
    //   req.ip,
    //   req.subdomains,
    //   req.route,
    //   req.path,
    //   req.protocol,
    // );
    const { protocol } = req;
    const { host } = headers;
    let { range } = headers;
    if (!range) range = 'bytes=0-';
    console.log(
      '🚀 ~ file: app.controller.ts:84 ~ AppController ~ range:',
      range,
    );
    // const readStream = createReadStream(
    //   join(process.cwd(), 'uploads', query.fileName),
    // );
    // res.set({
    //   'Accept-Ranges': 'bytes',
    //   'Content-Type': 'video/mp4',
    //   // 'Content-Disposition': `attachment; filename=${query.fileName}`,
    // });
    // // readStream.on('data', (chunk) => new StreamableFile(chunk)); // <--- the data log gets printed
    // // readStream.on('end', () => console.log('done'));
    // // readStream.on('error', (err) => {
    // //   console.error(err);
    // // });
    // return new StreamableFile(readStream);
    // const filePath = protocol + '://' + host + '/' + query.fileName;

    const videoPath = join(process.cwd(), 'uploads', query.fileName);

    // 10 powered by 6 equal 1000000bytes = 1mb

    // // calculating video where to start and where to end.
    const fileSize = statSync(videoPath).size;
    const chunkSize = 10 ** 6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, fileSize - 1);
    // const contentLength = end - start + 1;
    res.set({
      'Content-Type': 'video/mp4',
      'Content-Length': end - start,
      'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
      'Accept-Ranges': 'bytes',
    });
    const fileStream = createReadStream(videoPath, { start, end });
    return new StreamableFile(fileStream);

    // return filePath;
    // res.redirect(filePath);
  }
}
