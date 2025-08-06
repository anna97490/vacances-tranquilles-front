import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor(@Inject('APP_CONFIG') private config: any, private http: HttpClient) {}

  get apiUrl(): string {
    return this.config?.apiUrl || '';
  }

  async loadConfig(): Promise<void> {
    const config = await firstValueFrom(this.http.get('/assets/config.json'));
    this.config = config;
  }
}

