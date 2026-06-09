import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getProjects } from "../../services/projectService.js";
import type { Project } from "@opsflow/shared";

const LAST_PROJECT_KEY = "opsflow:last-project-key";

export const useProjectStore = defineStore("projects", () => {
  const projects = ref<Project[]>([]);
  const currentProjectKey = ref<string>(loadLastProjectKey());
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const currentProject = computed(() =>
    projects.value.find((p) => p.key === currentProjectKey.value) ?? null
  );

  function loadLastProjectKey(): string {
    try {
      return localStorage.getItem(LAST_PROJECT_KEY) || "OPS";
    } catch {
      return "OPS";
    }
  }

  function saveLastProjectKey(key: string) {
    try {
      localStorage.setItem(LAST_PROJECT_KEY, key);
    } catch {
      // localStorage unavailable
    }
  }

  async function fetchProjects() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await getProjects();
      projects.value = response.data;
      // Ensure currentProjectKey is valid
      if (!projects.value.some((p) => p.key === currentProjectKey.value)) {
        currentProjectKey.value = projects.value[0]?.key ?? "OPS";
        saveLastProjectKey(currentProjectKey.value);
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load projects";
    } finally {
      isLoading.value = false;
    }
  }

  function setCurrentProject(key: string) {
    if (projects.value.some((p) => p.key === key)) {
      currentProjectKey.value = key;
      saveLastProjectKey(key);
    }
  }

  return {
    projects,
    currentProjectKey,
    currentProject,
    isLoading,
    error,
    fetchProjects,
    setCurrentProject,
  };
});
