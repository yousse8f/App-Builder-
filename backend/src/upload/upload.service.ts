import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  getFileUrl(filename: string): string {
    const baseUrl = process.env.API_URL || 'http://localhost:3001';
    return `${baseUrl}/uploads/${filename}`;
  }
}
