import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

// Accept any livestock type string provided by the frontend

export class SubmitPriceDto {
  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(50.0, { message: 'Price must be at least 50.00 PHP per kilogram' })
  @Max(500.0, { message: 'Price must not exceed 500.00 PHP per kilogram' })
  pricePerKg: number;

  @IsOptional()
  @IsString()
  livestockType?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  dateObserved?: string;
}
