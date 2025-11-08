import { Controller, Get, Res, Param } from '@nestjs/common';
import * as path from 'path';

@Controller()
export class UiController {
  @Get('ui')
  serveIndex(@Res() res: any) {
    const file = path.join(process.cwd(), 'src', 'ui', 'frontend', 'index.html');
    return res.sendFile(file);
  }

  @Get('ui/assets/:file')
  serveAsset(@Param('file') file: string, @Res() res: any) {
    const p = path.join(process.cwd(), 'src', 'ui', 'frontend', file);
    return res.sendFile(p);
  }
}
