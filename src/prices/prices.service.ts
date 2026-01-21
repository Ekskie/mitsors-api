import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { priceInputs } from '../database/schema';
import { eq, and, sql } from 'drizzle-orm';
import {
  GetAggregatedPricesDto,
  GetRegionalPricesDto,
  SubmitPriceDto,
} from './dto';

@Injectable()
export class PricesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  /**
   * Get aggregated prices for a specific region and city
   */
  async getAggregatedPrices(dto: GetAggregatedPricesDto) {
    const { region, city } = dto;

    // Query for verified average
    const verifiedResult = await this.drizzleService.db
      .select({
        price_per_kg: sql<number>`ROUND(AVG(${priceInputs.pricePerKg}::numeric), 2)`,
        sample_size: sql<number>`COUNT(*)::int`,
        last_updated: sql<string>`MAX(${priceInputs.createdAt})`,
      })
      .from(priceInputs)
      .where(
        and(
          eq(priceInputs.region, region),
          eq(priceInputs.city, city),
          eq(priceInputs.verificationStatus, 'verified'),
        ),
      );

    // Query for unverified average
    const unverifiedResult = await this.drizzleService.db
      .select({
        price_per_kg: sql<number>`ROUND(AVG(${priceInputs.pricePerKg}::numeric), 2)`,
        sample_size: sql<number>`COUNT(*)::int`,
        last_updated: sql<string>`MAX(${priceInputs.createdAt})`,
      })
      .from(priceInputs)
      .where(
        and(
          eq(priceInputs.region, region),
          eq(priceInputs.city, city),
          eq(priceInputs.verificationStatus, 'unverified'),
        ),
      );

    const verified = verifiedResult[0];
    const unverified = unverifiedResult[0];

    // Check if we have any data
    const hasData = (verified?.sample_size ?? 0) > 0 || (unverified?.sample_size ?? 0) > 0;

    if (!hasData) {
      return {
        verifiedAverage: null,
        unverifiedAverage: null,
        region,
        city,
        message: 'No data available for this location',
      };
    }

    return {
      verifiedAverage:
        verified?.sample_size > 0
          ? {
              pricePerKg: verified.price_per_kg ? parseFloat(verified.price_per_kg.toString()) : null,
              sampleSize: verified.sample_size,
              lastUpdated: verified.last_updated,
            }
          : null,
      unverifiedAverage:
        unverified?.sample_size > 0
          ? {
              pricePerKg: unverified.price_per_kg ? parseFloat(unverified.price_per_kg.toString()) : null,
              sampleSize: unverified.sample_size,
              lastUpdated: unverified.last_updated,
            }
          : null,
      region,
      city,
    };
  }

  /**
   * Get regional price data for all Philippine regions
   */
  async getRegionalPrices(dto: GetRegionalPricesDto) {
    const { sort = 'region', order = 'asc', search } = dto;

    // Build the query for regional aggregation
    let query = this.drizzleService.db
      .select({
        region: priceInputs.region,
        verified_average: sql<number | null>`ROUND(AVG(CASE WHEN ${priceInputs.verificationStatus} = 'verified' THEN ${priceInputs.pricePerKg}::numeric END), 2)`,
        unverified_average: sql<number | null>`ROUND(AVG(CASE WHEN ${priceInputs.verificationStatus} = 'unverified' THEN ${priceInputs.pricePerKg}::numeric END), 2)`,
        last_updated: sql<string>`MAX(${priceInputs.createdAt})`,
        verified_sample_size: sql<number>`COUNT(*) FILTER (WHERE ${priceInputs.verificationStatus} = 'verified')::int`,
        unverified_sample_size: sql<number>`COUNT(*) FILTER (WHERE ${priceInputs.verificationStatus} = 'unverified')::int`,
      })
      .from(priceInputs)
      .groupBy(priceInputs.region);

    // Execute query
    let regions = await query;

    // Apply search filter if provided
    if (search) {
      regions = regions.filter((r) =>
        r.region.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Sort the results
    regions.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sort) {
        case 'verifiedAverage':
          aVal = a.verified_average ?? -Infinity;
          bVal = b.verified_average ?? -Infinity;
          break;
        case 'unverifiedAverage':
          aVal = a.unverified_average ?? -Infinity;
          bVal = b.unverified_average ?? -Infinity;
          break;
        case 'lastUpdated':
          aVal = new Date(a.last_updated).getTime();
          bVal = new Date(b.last_updated).getTime();
          break;
        default: // 'region'
          aVal = a.region;
          bVal = b.region;
      }

      if (order === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      } else {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
    });

    // Format the response
    const formattedRegions = regions.map((r) => ({
      region: r.region,
      verifiedAverage: r.verified_average
        ? parseFloat(r.verified_average.toString())
        : null,
      unverifiedAverage: r.unverified_average
        ? parseFloat(r.unverified_average.toString())
        : null,
      priceChange: null, // Reserved for future use
      lastUpdated: r.last_updated,
      verifiedSampleSize: r.verified_sample_size,
      unverifiedSampleSize: r.unverified_sample_size,
    }));

    // Total regions equals the number of regions returned (no hardcoding)
    const totalRegions = formattedRegions.length;
    const regionsWithData = formattedRegions.length;

    if (regionsWithData === 0) {
      return {
        regions: [],
        totalRegions,
        regionsWithData: 0,
        message: 'No price data available',
      };
    }

    return {
      regions: formattedRegions,
      totalRegions,
      regionsWithData,
    };
  }

  /**
   * Submit a new price input (authenticated users only)
   */
  async submitPrice(userId: string, dto: SubmitPriceDto) {
    const {
      region,
      city,
      pricePerKg,
      livestockType,
      breed,
      notes,
      dateObserved,
    } = dto;

    // Always use camelCase for API
    const verificationStatus = 'unverified';
    const observedDate = dateObserved ? new Date(dateObserved) : new Date();
    const result = await this.drizzleService.db
      .insert(priceInputs)
      .values({
        userId,
        verificationStatus,
        region,
        city,
        pricePerKg: pricePerKg.toString(),
        livestockType: livestockType ?? null,
        breed: breed || null,
        notes: notes || null,
        dateObserved: observedDate,
      })
      .returning();

    const priceInput = result[0];

    return {
      success: true,
      message: 'Price submitted successfully!',
      data: {
        id: priceInput.id,
        userId: priceInput.userId,
        verificationStatus: priceInput.verificationStatus,
        region: priceInput.region,
        city: priceInput.city,
        pricePerKg: parseFloat(priceInput.pricePerKg),
        livestockType: priceInput.livestockType,
        breed: priceInput.breed,
        notes: priceInput.notes,
        dateObserved: priceInput.dateObserved,
        createdAt: priceInput.createdAt,
      },
    };
  }
}
