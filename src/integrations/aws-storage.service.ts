import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  FileInStorage,
  FileUpload,
  StorageService,
} from './storage/storage.interface';

export class AwsStorageService implements StorageService {
  s3Client: S3;
  readonly bucket: string;

  constructor() {
    this.s3Client = new S3({
      region: process.env.AWS_REGION ? process.env.AWS_REGION : 'sa-east-1',
    });
    this.bucket = `bossabox-labs-${process.env.NODE_ENV}`;
  }
  async removeFolder(file: FileInStorage): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Prefix: file.Key,
      Delete: { Objects: [] },
    };
    const data = await this.s3Client.listObjects(params);
    if (data && data.Contents) {
      for (let i = 0; i < data.Contents.length; i++) {
        const content = data.Contents[i];
        params.Delete.Objects.push({ Key: content.Key });
      }
      await this.s3Client.deleteObjects(params);
    }
  }

  async uploadFile(file: FileUpload): Promise<string> {
    const base64data = Buffer.from(file.Body);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: file.Key,
        Body: base64data,
        ContentType: file.ContentType,
      }),
    );
    const signedUrl = await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({ ...file, Bucket: this.bucket }),
    );
    return signedUrl;
  }

  async removeFile(file: FileInStorage): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: file.Key,
    };
    await this.s3Client.deleteObject(params);
  }
}
