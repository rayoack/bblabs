import { ContactHubspotEvent } from '../../../src/integrations/dtos/contact-hubspot.dto';
import { bossaboxApi } from '../../__helpers__/bossabox-api.service.mock';
import { UpdateContactListener } from '../../../src/domain/squad/listeners/update-contact.listener';

const event: ContactHubspotEvent = {
  challengeName: 'string',
  squadName: 'string',
  professionalType: 'string',
  isCreator: true,
  token: '',
};

describe('Update Contact Listener', () => {
  describe('when the bossabox api returns OK', () => {
    it('must return the result', () => {
      let err: Error;
      const bbApi = bossaboxApi();
      const updateUserSpy = jest
        .spyOn(bbApi, 'updateUser')
        .mockResolvedValue({ data: true });
      try {
        const listener = new UpdateContactListener(bbApi);
        listener.handleOrderCreatedEvent(event);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(updateUserSpy).toHaveBeenCalledWith(event.token, {
        challengeName: 'string',
        squadName: 'string',
        professionalType: 'string',
        isCreator: true,
      });
    });
  });

  describe('When the bossabox api returns Error', () => {
    it('must to catch the error', () => {
      let err: Error;
      const bbApi = bossaboxApi();
      const updateUserSpy = jest
        .spyOn(bbApi, 'updateUser')
        .mockRejectedValue({ data: true });
      try {
        const listener = new UpdateContactListener(bbApi);
        listener.handleOrderCreatedEvent(event);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(updateUserSpy).toHaveBeenCalledWith(event.token, {
        challengeName: 'string',
        squadName: 'string',
        professionalType: 'string',
        isCreator: true,
      });
    });
  });
});
