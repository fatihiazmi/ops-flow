import { findAllProjects, findProjectByKey } from "./project.repository.js";
import { success, listSuccess } from "../../utils/api-response.js";
import { AppError } from "../../utils/errors.js";
import { toProjectDTO } from "./project.types.js";

export async function listProjects() {
  const rows = await findAllProjects();
  return listSuccess(rows.map(toProjectDTO), {
    page: 1,
    pageSize: rows.length,
    total: rows.length,
    totalPages: 1,
  });
}

export async function getProjectByKey(key: string) {
  const project = await findProjectByKey(key);
  if (!project) {
    throw new AppError("PROJECT_NOT_FOUND", `Project "${key}" not found`, 404);
  }
  return success(toProjectDTO(project));
}
