import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";

export {sql, eq, and, or, desc} from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

const {databaseUrl} = useRuntimeConfig()

const client = postgres(databaseUrl);

export function useDrizzle() {
    return drizzle(client, {schema});
}
