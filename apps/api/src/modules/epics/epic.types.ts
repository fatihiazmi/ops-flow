import type { Epic, EpicRef } from "@opsflow/shared";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema/index.js";

export interface EpicRow {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  ownerId: string | null;
  startAt: Date | null;
  dueAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EpicWithOwnerRow extends EpicRow {
  ownerName: string | null;
}

export function toEpicDTO(row: EpicWithOwnerRow): Epic {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    description: row.description,
    status: row.status as Epic["status"],
    ownerId: row.ownerId,
    owner: row.ownerId && row.ownerName
      ? { id: row.ownerId, name: row.ownerName }
      : null,
    startAt: row.startAt ? row.startAt.toISOString() : null,
    dueAt: row.dueAt ? row.dueAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toEpicRef(row: { id: string; title: string }): EpicRef {
  return { id: row.id, title: row.title };
}

export type DBOrTx = NodePgDatabase<typeof schema> | Parameters<Parameters<NodePgDatabase<typeof schema>["transaction"]>[0]>[0];
