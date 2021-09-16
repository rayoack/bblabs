import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AwsStorageService } from '../../src/integrations/aws-storage.service';
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

const mockListObject = (s3Storage: AwsStorageService, result: any) => {
  return spyOn(s3Storage.s3Client, 'listObjects').and.returnValue(
    Promise.resolve(result),
  );
};

describe('AWS Storage Service', () => {
  describe('removeFolder', () => {
    describe('when have some data', () => {
      it('must call the deleteObject method', async () => {
        const s3Storage = new AwsStorageService();
        const listObjectMock = mockListObject(s3Storage, {
          Contents: [{ Key: '123' }],
        });
        const deleteObjectMock = spyOn(s3Storage.s3Client, 'deleteObjects');
        let err: Error;
        try {
          await s3Storage.removeFolder({ Key: '123' });
        } catch (error) {
          err = error;
        }
        expect(err).toBeUndefined();
        expect(listObjectMock).toHaveBeenCalled();
        expect(deleteObjectMock).toHaveBeenCalled();
      });
    });

    describe("when dont' have any data", () => {
      let s3Storage: AwsStorageService, deleteObjectMock: jasmine.Spy;
      beforeEach(() => {
        s3Storage = new AwsStorageService();
        deleteObjectMock = spyOn(s3Storage.s3Client, 'deleteObjects');
      });
      it('must return null', async () => {
        const listObjectMock = mockListObject(s3Storage, undefined);
        let err: Error;
        try {
          await s3Storage.removeFolder({ Key: '123' });
        } catch (error) {
          err = error;
        }
        expect(err).toBeUndefined();
        expect(listObjectMock).toHaveBeenCalled();
        expect(deleteObjectMock).not.toHaveBeenCalled();
      });
      it('must return null', async () => {
        const listObjectMock = mockListObject(s3Storage, {
          Contents: undefined,
        });
        let err: Error;
        try {
          await s3Storage.removeFolder({ Key: '123' });
        } catch (error) {
          err = error;
        }
        expect(err).toBeUndefined();
        expect(listObjectMock).toHaveBeenCalled();
        expect(deleteObjectMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('uploadFile', () => {
    it('when the file is send should get the Url Signed', async () => {
      const s3Storage = new AwsStorageService();
      const sendMock = spyOn(s3Storage.s3Client, 'send');
      let err: Error;
      try {
        await s3Storage.uploadFile({
          Key: '123',
          Body: Buffer.from('123'),
          ContentType: 'test/test',
        });
      } catch (error) {
        err = error;
        console.log(error);
      }
      expect(err).toBeUndefined();
      expect(sendMock).toHaveBeenCalled();
    });
  });

  describe('removeFile', () => {
    it('should to call the deleteObject', async () => {
      const s3Storage = new AwsStorageService();
      const deleteObjectMock = spyOn(s3Storage.s3Client, 'deleteObject');
      let err: Error;
      try {
        await s3Storage.removeFile({ Key: '123' });
      } catch (error) {
        err = error;
      }
      expect(err).toBeUndefined();
      expect(deleteObjectMock).toHaveBeenCalled();
    });
  });
});
