import type { Project, ProjectRef } from "@opsflow/shared";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema/index.js";

export interface ProjectRow {
  id: string;
  key: string;
  name: string;
  description: string;
  leadId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toProjectDTO(row: ProjectRow): Project {
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    description: row.description,
    leadId: row.leadId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toProjectRef(row: { id: string; key: string; name: string }): ProjectRef {
  return { id: row.id, key: row.key, name: row.name };
}

export type DBOrTx = NodePgDatabase<typeof schema> | Parameters<Parameters<NodePgDatabase<typeof schema>["transaction"]>[0]>[0];
