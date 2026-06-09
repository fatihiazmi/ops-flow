import { epicListQuerySchema } from "./epic.schemas.js";
import { findEpicsByProject, findEpicById } from "./epic.repository.js";
import { findProjectByKey } from "../projects/project.repository.js";
import { toEpicDTO } from "./epic.types.js";
import { success, listSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/errors.js";

export async function listEpicsByProject(projectKey: string, query: unknown) {
  const parsed = epicListQuerySchema.safeParse(query);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid query parameters", 400);
  }

  const project = await findProjectByKey(projectKey);
  if (!project) {
    throw new AppError("PROJECT_NOT_FOUND", `Project "${projectKey}" not found`, 404);
  }

  const { data, total } = await findEpicsByProject(project.id, parsed.data);
  const totalPages = Math.ceil(total / parsed.data.pageSize);

  return listSuccess(data.map(toEpicDTO), {
    page: parsed.data.page,
    pageSize: parsed.data.pageSize,
    total,
    totalPages,
  });
}

export async function getEpicById(projectKey: string, epicId: string) {
  const project = await findProjectByKey(projectKey);
  if (!project) {
    throw new AppError("PROJECT_NOT_FOUND", `Project "${projectKey}" not found`, 404);
  }

  const epic = await findEpicById(epicId);
  if (!epic || epic.projectId !== project.id) {
    throw new AppError("EPIC_NOT_FOUND", "Epic not found", 404);
  }

  return success(toEpicDTO(epic));
}
