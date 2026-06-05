import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Capturar IP real (considerando proxies)
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] 
      || req.ip 
      || req.connection?.remoteAddress 
      || 'unknown';
    
    // Capturar browser del User-Agent
    const browser = req.headers['user-agent'] || 'unknown';
    
    // Adjuntar información al request para usarla en controllers
    req['clientInfo'] = { ip, browser };
    
    next();
  }
}