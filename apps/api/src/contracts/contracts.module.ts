import { Module } from '@nestjs/common'
import { ContractsController } from './contracts.controller'
import { ContractsService } from './contracts.service'
import { UploadModule } from '../upload/upload.module'
@Module({ imports: [UploadModule], controllers: [ContractsController], providers: [ContractsService] })
export class ContractsModule {}
