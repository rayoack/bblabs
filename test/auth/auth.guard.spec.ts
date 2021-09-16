import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../../src/auth/auth.guard';
import { AuthService } from '../../src/auth/auth.service';
import { executionContextMock } from '../__helpers__/execution-context.mock';

describe('AuthGuard', () => {
  describe("when the header does'nt have the authorization key", () => {
    it('should return false', async () => {
      const context: ExecutionContext = executionContextMock({});
      const resp = await new AuthGuard(null).canActivate(context);
      expect(resp).toEqual(false);
    });
  });

  describe('when the header have authorization key but is empty', () => {
    it('should return false', async () => {
      const context: ExecutionContext = executionContextMock({
        authorization: 'Bearer',
      });
      const resp = await new AuthGuard(null).canActivate(context);
      expect(resp).toEqual(false);
    });
  });

  describe('when the authservice return an exception', () => {
    it('should return false', async () => {
      const context: ExecutionContext = executionContextMock({
        authorization: 'Bearer 12345',
      });
      const authService = new AuthService();
      const validateTokenSpy = spyOn(
        authService,
        'validateToken',
      ).and.returnValue(Promise.reject('Invalid Token'));
      const resp = await new AuthGuard(authService).canActivate(context);
      expect(validateTokenSpy).toHaveBeenCalledWith('12345');
      expect(resp).toEqual(false);
    });
  });

  describe('whent the authservice found the user', () => {
    it('should return true', async () => {
      const context: ExecutionContext = executionContextMock({
        authorization: 'Bearer 12345',
      });
      const authService = new AuthService();
      const validateTokenSpy = spyOn(
        authService,
        'validateToken',
      ).and.returnValue(Promise.resolve(true));
      const resp = await new AuthGuard(authService).canActivate(context);
      expect(validateTokenSpy).toHaveBeenCalledWith('12345');
      expect(resp).toEqual(true);
    });
  });
});
