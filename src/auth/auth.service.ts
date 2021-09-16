import { Injectable } from '@nestjs/common';
import got from 'got';
import { UserBossaboxDto } from './dto/user-bossabox.dto';

@Injectable()
export class AuthService {
  async validateToken(token: string): Promise<UserBossaboxDto> {
    try {
      const { body } = await got.post(
        `${process.env.AUTH_API_URL}v1/auth/validate`,
        {
          json: { token },
          responseType: 'json',
        },
      );
      return body as UserBossaboxDto;
    } catch (error) {
      throw error;
    }
  }
}
