import { Injectable, Inject } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudStorageService {
  private storage: Storage;
  private bucket: any;
  private uuid: string;

  constructor(
    @Inject('CustomConfigService') private readonly configService: any,
  ) {
    const projectId = this.configService.get('GCP_PROJECT_ID');
    const keyFilename = this.configService.get('GCP_KEY_FILE');

    this.storage = new Storage({
      projectId: projectId,
      keyFilename: keyFilename,
    });

    this.bucket = this.storage.bucket(
      this.configService.get('GCP_BUCKET_NAME'),
    );

    this.uuid = uuidv4();
  }

  async uploadFile(file: any, pathImage: string): Promise<string> {
    if (!file || !pathImage) {
      throw new Error('File or pathImage is missing');
    }

    const fileUpload = this.bucket.file(`${pathImage}`);
    return new Promise((resolve, reject) => {
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype || 'application/octet-stream',
          metadata: {
            firebaseStorageDownloadTokens: this.uuid,
          },
        },
        resumable: false,
      });

      blobStream.on('error', (err) => {
        console.error('Upload error:', err);
        reject('Unable to upload file.');
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileUpload.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }
}
