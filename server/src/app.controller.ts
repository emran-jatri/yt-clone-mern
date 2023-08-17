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
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { createReadStream, readdirSync } from 'fs';
import type { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const fileList = readdirSync('./uploads');
    console.log(
      '🚀 ~ file: app.controller.ts:21 ~ AppController ~ getHello ~ fileList:',
      fileList,
    );
    return this.appService.getHello();
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

    // console.log(
    //   '🚀 ~ file: app.controller.ts:56 ~ AppController ~ headers:',
    //   headers,
    // );
    // const file = createReadStream(
    //   join(process.cwd(), 'uploads', query.fileName),
    // );
    // console.log(
    //   '🚀 ~ file: app.controller.ts:57 ~ AppController ~ file:',
    //   file,
    // );
    // res.set({
    //   'Content-Type': 'application/json',
    //   'Content-Disposition': `attachment; filename=${query.fileName}`,
    // });
    // return new StreamableFile(file);
    const filePath = protocol + '://' + host + '/' + query.fileName;
    console.log(
      '🚀 ~ file: app.controller.ts:90 ~ AppController ~ filePath:',
      filePath,
    );
    res.redirect(filePath);
  }
}
