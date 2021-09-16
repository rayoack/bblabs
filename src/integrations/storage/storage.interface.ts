export interface FileInStorage {
  Key: string;
}

export interface FileUpload extends FileInStorage {
  Body: Buffer;
  ContentType: string;
}

export interface StorageService {
  uploadFile(file: FileUpload): Promise<string>;

  removeFile(file: FileInStorage): Promise<void>;

  removeFolder(file: FileInStorage): Promise<void>;
}
