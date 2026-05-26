import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key:    this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    })
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'afroglow',
  ): Promise<{ url: string; filename: string; size: number }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error || !result) return reject(new InternalServerErrorException('Upload failed'))
          resolve({ url: result.secure_url, filename: result.public_id, size: file.size })
        },
      )
      stream.end(file.buffer)
    })
  }
}
