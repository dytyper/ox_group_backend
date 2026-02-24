import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class GetProductsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  size!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  companyId!: number;
}

