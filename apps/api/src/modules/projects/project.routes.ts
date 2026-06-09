import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { listProjects, getProjectByKey } from "./project.service.js";

const projectRoutes = new Hono();

projectRoutes.use(authMiddleware);

projectRoutes.get("/", async (c) => {
  const result = await listProjects();
  return c.json(result);
});

projectRoutes.get("/:projectKey", async (c) => {
  const projectKey = c.req.param("projectKey");
  const result = await getProjectByKey(projectKey);
  return c.json(result);
});

export { projectRoutes };
