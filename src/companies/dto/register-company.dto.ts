import { IsString } from 'class-validator';

export class RegisterCompanyDto {
  @IsString()
  token!: string;

  @IsString()
  subdomain!: string;
}

