import { IsString, IsOptional, IsIn } from 'class-validator';

export class GetRegionalPricesDto {
  @IsOptional()
  @IsString()
  @IsIn(['region', 'verifiedAverage', 'unverifiedAverage', 'lastUpdated'])
  sort?: string = 'region';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: string = 'asc';

  @IsOptional()
  @IsString()
  search?: string;
}
