import {
  Controller, Post, UseInterceptors, UploadedFile,
  UploadedFiles, UseGuards, BadRequestException,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { UploadService } from './upload.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload avatar image' })
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required')
    return this.uploadService.uploadFile(file, 'afroglow/avatars')
  }

  @Post('portfolio')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload portfolio images (max 10)' })
  async uploadPortfolio(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) throw new BadRequestException('Files are required')
    return Promise.all(files.map(f => this.uploadService.uploadFile(f, 'afroglow/portfolio')))
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a document (PDF)' })
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required')
    return this.uploadService.uploadFile(file, 'afroglow/documents')
  }
}
