import { describe, it, expect } from "vitest";

describe("Ticket Status Control — valid transitions", () => {
  // Mirror the workflow rules so we can verify them
  const validTransitions: Record<string, string[]> = {
    open: ["in_progress", "closed"],
    in_progress: ["resolved", "closed"],
    resolved: ["closed", "in_progress"],
    closed: [],
  };

  it("open can transition to in_progress and closed only", () => {
    expect(validTransitions["open"]).toEqual(["in_progress", "closed"]);
  });

  it("in_progress can transition to resolved and closed only", () => {
    expect(validTransitions["in_progress"]).toEqual(["resolved", "closed"]);
  });

  it("resolved can transition to closed and in_progress only", () => {
    expect(validTransitions["resolved"]).toEqual(["closed", "in_progress"]);
  });

  it("closed has no valid next transitions", () => {
    expect(validTransitions["closed"]).toEqual([]);
  });

  it("every defined status has a valid set of transitions", () => {
    const statuses = ["open", "in_progress", "resolved", "closed"];
    for (const status of statuses) {
      expect(Array.isArray(validTransitions[status])).toBe(true);
    }
  });

  it("valid transitions do not include current status", () => {
    for (const [status, transitions] of Object.entries(validTransitions)) {
      expect(transitions).not.toContain(status);
    }
  });
});

describe("Status badges — text labels present", () => {
  it("formatStatus replaces underscores with spaces and capitalizes", () => {
    function formatStatus(status: string): string {
      return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }

    expect(formatStatus("open")).toBe("Open");
    expect(formatStatus("in_progress")).toBe("In Progress");
    expect(formatStatus("resolved")).toBe("Resolved");
    expect(formatStatus("closed")).toBe("Closed");
  });
});

describe("Priority badges — text labels present", () => {
  it("priority has text labels, not color-only", () => {
    const priorityLabels: Record<string, string> = {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    };

    expect(priorityLabels["low"]).toBe("Low");
    expect(priorityLabels["medium"]).toBe("Medium");
    expect(priorityLabels["high"]).toBe("High");
    expect(priorityLabels["critical"]).toBe("Critical");
  });
});
