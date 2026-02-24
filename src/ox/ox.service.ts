import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OxService {
  constructor(private readonly http: HttpService) {}

  private buildBaseUrl(subdomain: string, endpoint: string): string {
    return `https://${subdomain}.ox-sys.com${endpoint}`;
  }

  async validateToken(token: string, subdomain: string): Promise<any> {
    const url = this.buildBaseUrl(subdomain, '/profile');
    try {
      const response$ = this.http.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      });
      const { data } = await firstValueFrom(response$);
      return data;
    } catch (error) {
      throw new UnauthorizedException('Invalid OX token');
    }
  }

  async getVariations(
    subdomain: string,
    token: string,
    page: number,
    size: number,
  ): Promise<any> {
    const url = this.buildBaseUrl(subdomain, `/variations?page=${page}&size=${size}`);
    const response$ = this.http.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
    });
    const { data } = await firstValueFrom(response$);
    return data;
  }
}

