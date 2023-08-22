import {
  Controller,
  Get,
  Header,
  Headers,
  HttpStatus,
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
        // const url = protocol + '://' + host + '/' + name;
        const url = `${protocol}://${host}/get-file/?fileName=${name}`;
        const videoPath = join(process.cwd(), 'uploads', name);
        const fileSize = statSync(videoPath).size;
        videoList.push({
          id: index + 1,
          videoUrl: url,
          size: fileSize,
          // isHovered: false,
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
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  getFile(
    @Res() res: Response,
    @Query() query: { fileName: string },
    @Headers() headers,
    @Req() req: Request,
  ) {
    // const file = createReadStream(
    //   join(process.cwd(), 'uploads', query.fileName),
    // );
    // return new StreamableFile(file);
    const videoPath = `uploads/${query.fileName}`;
    const { size } = statSync(videoPath);
    console.log(
      '🚀 ~ file: video.controller.ts:28 ~ VideoController ~ videoPath:',
      videoPath,
    );
    const videoRange = headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunkSize = end - start + 1;
      const readStreamfile = createReadStream(videoPath, {
        start,
        end,
        highWaterMark: 60,
      });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Content-Length': chunkSize,
      };
      res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
      readStreamfile.pipe(res);
      // return new StreamableFile(readStreamfile);
    } else {
      const head = {
        'Content-Length': size,
      };
      res.writeHead(HttpStatus.OK, head); //200
      createReadStream(videoPath).pipe(res);
      // return new StreamableFile(createReadStream(videoPath));
    }
  }
}
