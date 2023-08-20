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
      fileList.forEach((name) => {
        const url = protocol + '://' + host + '/' + name;
        const videoPath = join(process.cwd(), 'uploads', name);
        const fileSize = statSync(videoPath).size;
        videoList.push({
          videoUrl: url,
          size: fileSize,
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
    const readStream = createReadStream(
      join(process.cwd(), 'uploads', query.fileName),
    );
    res.set({
      'Accept-Ranges': 'bytes',
      'Content-Type': 'video/mp4',
      // 'Content-Disposition': `attachment; filename=${query.fileName}`,
    });
    // readStream.on('data', (chunk) => new StreamableFile(chunk)); // <--- the data log gets printed
    // readStream.on('end', () => console.log('done'));
    // readStream.on('error', (err) => {
    //   console.error(err);
    // });
    return new StreamableFile(readStream);
    const filePath = protocol + '://' + host + '/' + query.fileName;

    const videoPath = join(process.cwd(), 'uploads', query.fileName);
    const fileSize = statSync(videoPath).size;
    console.log(
      '🚀 ~ file: app.controller.ts:92 ~ AppController ~ fileSize:',
      fileSize,
    );

    // 10 powered by 6 equal 1000000bytes = 1mb
    const chunkSize = 10 ** 6;

    // // calculating video where to start and where to end.
    // const start = Number(range.replace(/\D/g, ''));
    // const end = Math.min(start + chunkSize, videoSize - 1);
    // const contentLength = end - start + 1;

    return filePath;
    // res.redirect(filePath);
  }
}
