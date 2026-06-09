import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { listEpicsByProject, getEpicById } from "./epic.service.js";

const epicRoutes = new Hono();

epicRoutes.use(authMiddleware);

epicRoutes.get("/", async (c) => {
  const projectKey = c.req.param("projectKey")!;
  const query = c.req.query();
  const result = await listEpicsByProject(projectKey, query);
  return c.json(result);
});

epicRoutes.get("/:epicId", async (c) => {
  const projectKey = c.req.param("projectKey")!;
  const epicId = c.req.param("epicId")!;
  const result = await getEpicById(projectKey, epicId);
  return c.json(result);
});

export { epicRoutes };
