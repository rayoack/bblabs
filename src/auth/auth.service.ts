import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserBossaboxDto } from './dto/user-bossabox.dto';

@Injectable()
export class AuthService {
  async validateToken(token: string) {
    try {
      return jwt.verify(token, 'f0b987c169af987f6e254914763e1234');
    } catch (error) {
      throw error;
    }
  }
}
