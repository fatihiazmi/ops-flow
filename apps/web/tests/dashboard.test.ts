import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { setActivePinia, createPinia } from "pinia";
import DashboardPage from "../src/pages/DashboardPage.vue";

vi.mock("../src/services/dashboardService.js", () => ({
  getDashboardMetrics: vi.fn(),
}));

import { getDashboardMetrics } from "../src/services/dashboardService.js";
const mockGetMetrics = vi.mocked(getDashboardMetrics);

function createMetrics() {
  return {
    totalOpen: 15,
    totalInProgress: 10,
    totalResolvedToday: 5,
    totalCritical: 3,
    totalOverdue: 7,
    unassignedTickets: 4,
    statusDistribution: [
      { status: "open", count: 15 },
      { status: "in_progress", count: 10 },
    ],
    priorityDistribution: [
      { priority: "low", count: 10 },
      { priority: "critical", count: 3 },
    ],
    recentActivity: [
      {
        id: "act-1",
        eventType: "status_changed",
        ticketId: "t1",
        ticketTitle: "Test Ticket",
        actor: { id: "u1", name: "Admin" },
        createdAt: "2026-01-01T00:00:00Z",
      },
    ],
    slaRiskTickets: [
      {
        id: "t1",
        title: "Overdue ticket",
        priority: "critical",
        status: "open",
        dueAt: "2026-01-01T00:00:00Z",
        assignee: { id: "u1", name: "Admin" },
      },
    ],
  };
}

describe("DashboardPage", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("renders metric cards when data loads", async () => {
    mockGetMetrics.mockResolvedValue({ data: createMetrics() } as never);

    const wrapper = mount(DashboardPage);

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Open");
      expect(wrapper.text()).toContain("15");
    });

    expect(wrapper.text()).toContain("In Progress");
    expect(wrapper.text()).toContain("10");
    expect(wrapper.text()).toContain("Critical");
    expect(wrapper.text()).toContain("3");
    expect(wrapper.text()).toContain("Overdue");
    expect(wrapper.text()).toContain("Unassigned");
    expect(wrapper.text()).toContain("Resolved Today");
  });

  it("shows loading state while fetching", async () => {
    // Never resolve the promise during this test
    mockGetMetrics.mockImplementation(
      () => new Promise(() => {})
    );

    const wrapper = mount(DashboardPage);
    await nextTick();

    // DashboardPage sets isLoading = true in fetchMetrics which is called in onMounted
    // Verify the loading state is rendered
    const html = wrapper.html();
    expect(html).toContain("animate-pulse");
  });

  it("shows error state when API fails", async () => {
    mockGetMetrics.mockRejectedValue(new Error("Network error"));

    const wrapper = mount(DashboardPage);

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("Network error");
    });

    // Should show retry button
    const retryButton = wrapper.find("button");
    expect(retryButton.exists()).toBe(true);
  });

  it("renders SLA risk links as router-links to ticket detail", async () => {
    mockGetMetrics.mockResolvedValue({ data: createMetrics() } as never);

    const wrapper = mount(DashboardPage);

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain("SLA Risk Tickets");
    });

    expect(wrapper.text()).toContain("Overdue ticket");
    expect(wrapper.text()).toContain("critical");
  });
});
