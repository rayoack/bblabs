import got from 'got/dist/source';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthService', () => {
  describe('when the http request throw an error', () => {
    it('should return the response body', async () => {
      const authService = new AuthService();
      const token = '123456';
      const responseMock = { body: token };
      const gotSpy = spyOn(got, 'post').and.returnValue(
        Promise.resolve(responseMock),
      );
      let err: Error, response: any;
      try {
        response = await authService.validateToken(token);
      } catch (error) {
        err = error;
      }
      expect(err).not.toBeDefined();
      expect(response).toEqual(responseMock.body);
      expect(gotSpy).toHaveBeenCalledWith(expect.any(String), {
        json: { token },
        responseType: 'json',
      });
    });
  });

  describe('when the http request is successfully', () => {
    it('should throw the same error', async () => {
      const authService = new AuthService();
      const token = '123456';
      const gotSpy = spyOn(got, 'post').and.returnValue(
        Promise.reject('INVALID TOKEN'),
      );
      let err: Error, response: any;
      try {
        response = await authService.validateToken(token);
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(response).not.toBeDefined();
      expect(gotSpy).toHaveBeenCalledWith(expect.any(String), {
        json: { token },
        responseType: 'json',
      });
    });
  });
});
