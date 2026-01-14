import { IsString, IsNotEmpty } from 'class-validator';

export class GetAggregatedPricesDto {
  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}
