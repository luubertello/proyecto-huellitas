
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service'; 

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private authService: AuthService) { 
        super({
          clientID: process.env.GOOGLE_CLIENT_ID || '', 
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || '', 
          callbackURL: 'http://localhost:3000/auth/google/callback', 
          scope: ['email', 'profile'],
        });
      }

async validate(
    accessToken: string,
    refreshToken: string,
    profile: any, 
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, id: googleId } = profile;
    const userEmail = emails?.[0]?.value;
    
    if (!userEmail) {
      return done(new Error('No se pudo obtener el email de Google.'), false); 
    }

    try {
      // Buscamos o creamos el usuario
      const user = await this.authService.findOrCreateGoogleUser({
        googleId,
        email: userEmail,
        nombre: name?.givenName || 'Usuario', 
        apellido: name?.familyName || 'Google', 
      });
      
      done(null, user); 

    } catch (error) {
      done(error, false); 
    }
  }
}