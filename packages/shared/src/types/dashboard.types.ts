export interface DashboardMetrics {
  totalOpen: number;
  totalInProgress: number;
  totalResolvedToday: number;
  totalCritical: number;
  totalOverdue: number;
  unassignedTickets: number;
  statusDistribution: StatusDistribution[];
  priorityDistribution: PriorityDistribution[];
  recentActivity: RecentActivityItem[];
  slaRiskTickets: SlaRiskTicket[];
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface PriorityDistribution {
  priority: string;
  count: number;
}

export interface RecentActivityItem {
  id: string;
  eventType: string;
  ticketId: string;
  ticketTitle: string;
  actor: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface SlaRiskTicket {
  id: string;
  title: string;
  priority: string;
  status: string;
  dueAt: string | null;
  assignee: {
    id: string;
    name: string;
  } | null;
}
