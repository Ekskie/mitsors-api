import { pgTable, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const livestockType = pgEnum("livestock_type", ['fattener', 'piglet', 'both'])
export const verificationStatus = pgEnum("verification_status", ['verified', 'unverified'])



