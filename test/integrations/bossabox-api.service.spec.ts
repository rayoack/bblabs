import got from 'got';
import { BossaboxApiService } from '../../src/integrations/bossabox-api.service';
import { ContactHubspotEvent } from '../../src/integrations/dtos/contact-hubspot.dto';
import { logger } from '../../src/logging/logger';

const token = 'token';

const contactHubspot: ContactHubspotEvent = {
  challengeName: 'string',
  squadName: 'string',
  professionalType: 'string',
  isCreator: true,
  token: '',
};

const notificationMock = {
  title: 'Oba, mais uma pessoa no squad!🎉',
  text: 'Alguém entrou no seu squad do BossaBox Labs, clique aqui para ver quem foi.',
  iconType: 'challenge',
  url: '/bossabox-labs/como-funciona/desafios',
};

describe('BossaboxApiService', () => {
  describe('when the got patch is called', () => {
    it('should to call the got patch and return', async () => {
      const gotSpy = spyOn(got, 'patch').and.returnValue(
        Promise.resolve({ body: true }),
      );
      let err: Error, response: any;
      try {
        const service = new BossaboxApiService();
        response = await service.updateUser(token, contactHubspot);
      } catch (error) {
        err = error;
      }

      expect(err).not.toBeDefined();
      expect(response).toEqual(true);
      expect(gotSpy).toHaveBeenCalledWith(expect.any(String), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: contactHubspot,
        responseType: 'json',
      });
    });
    it('should to catch the error', async () => {
      const gotSpy = spyOn(got, 'patch').and.returnValue(
        Promise.reject({ body: true }),
      );
      const errorSpy = jest.spyOn(logger, 'error');
      let err: Error, response: any;
      try {
        const service = new BossaboxApiService();
        response = await service.updateUser(token, contactHubspot);
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(response).not.toBeDefined();
      expect(errorSpy).toHaveBeenCalled();
      expect(gotSpy).toHaveBeenCalledWith(expect.any(String), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        json: contactHubspot,
        responseType: 'json',
      });
    });
  });

  describe('sendNotification', () => {
    describe('when the usersId is undfinend', () => {
      it('should to return undefined', async () => {
        const resp = await new BossaboxApiService().sendNotification(
          null,
          null,
        );
        expect(resp).not.toBeDefined();
      });
    });
    describe('when git post called', () => {
      it('should to await the response', async () => {
        const gotPostSpy = spyOn(got, 'post').and.returnValue(
          Promise.resolve({}),
        );
        await new BossaboxApiService().sendNotification(notificationMock, [
          '23782364872634',
        ]);
        expect(gotPostSpy).toHaveBeenCalledWith(expect.any(String), {
          json: { notification: notificationMock, userIds: ['23782364872634'] },
          headers: {
            'bb-integration-token': undefined,
          },
        });
      });
      describe('when the got throw an exception', () => {
        it('should to catch the erro', async () => {
          const errorSpy = spyOn(logger, 'error');
          spyOn(got, 'post').and.returnValue(Promise.reject(new Error()));
          try {
            await new BossaboxApiService().sendNotification(notificationMock, [
              '23782364872634',
            ]);
          } catch (error) {}
          expect(errorSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
