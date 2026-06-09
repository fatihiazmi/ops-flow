<template>
  <aside
    class="ticket-context-panel flex flex-col h-full overflow-y-auto
           border-l border-slate-200 dark:border-slate-800
           bg-slate-50/50 dark:bg-slate-950/30"
    aria-label="Ticket context panel"
  >
    <div class="p-4 space-y-6">
      <!-- Details section -->
      <section aria-labelledby="context-details-heading">
        <h3 id="context-details-heading" class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-3">
          Details
        </h3>
        <dl class="space-y-3">
          <!-- Status -->
          <div>
            <dt class="text-[11px] text-gray-400 dark:text-slate-500 mb-1">Status</dt>
            <dd>
              <TicketStatusControl
                v-if="ticket"
                :ticket-id="ticket.id"
                :current-status="ticket.status"
                @updated="$emit('updated')"
              />
            </dd>
          </div>

          <!-- Priority -->
          <div>
            <dt class="text-[11px] text-gray-400 dark:text-slate-500 mb-1">Priority</dt>
            <dd>
              <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold capitalize"
                    :class="priorityBadgeClass">
                {{ ticket?.priority ?? "—" }}
              </span>
            </dd>
          </div>

          <!-- Category -->
          <div>
            <dt class="text-[11px] text-gray-400 dark:text-slate-500 mb-1">Category</dt>
            <dd class="text-sm text-gray-900 dark:text-slate-200 capitalize">
              {{ ticket?.category?.replace(/_/g, " ") ?? "—" }}
            </dd>
          </div>

          <!-- Due Date -->
          <div v-if="ticket?.dueAt">
            <dt class="text-[11px] text-gray-400 dark:text-slate-500 mb-1">Due Date</dt>
            <dd class="text-sm text-gray-900 dark:text-slate-200">
              {{ formattedDueDate }}
            </dd>
          </div>

          <!-- Created -->
          <div>
            <dt class="text-[11px] text-gray-400 dark:text-slate-500 mb-1">Created</dt>
            <dd class="text-sm text-gray-900 dark:text-slate-200">
              {{ formattedCreated }}
            </dd>
          </div>

          <!-- Updated -->
          <div>
            <dt class="text-[11px] text-gray-400 dark:text-slate-500 mb-1">Updated</dt>
            <dd class="text-sm text-gray-900 dark:text-slate-200">
              {{ formattedUpdated }}
            </dd>
          </div>
        </dl>
      </section>

      <!-- People section -->
      <section aria-labelledby="context-people-heading">
        <h3 id="context-people-heading" class="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-3">
          People
        </h3>

        <!-- Assignee -->
        <div class="mb-3">
          <dt class="text-[11px] text-gray-400 dark:text-slate-500 mb-1">Assignee</dt>
          <dd>
            <TicketAssigneeControl
              v-if="ticket"
              :ticket-id="ticket.id"
              :current-assignee="ticket.assignee"
              @updated="$emit('updated')"
            />
          </dd>
        </div>

        <!-- Reporter -->
        <div>
          <dt class="text-[11px] text-gray-400 dark:text-slate-500 mb-1">Reporter</dt>
          <dd class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span class="text-[10px] font-semibold text-blue-400">
                {{ reporterInitials }}
              </span>
            </div>
            <span class="text-sm text-gray-900 dark:text-slate-200 truncate">
              {{ ticket?.createdBy?.name ?? "—" }}
            </span>
          </dd>
        </div>
      </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TicketDetail } from "@opsflow/shared";
import TicketStatusControl from "./TicketStatusControl.vue";
import TicketAssigneeControl from "./TicketAssigneeControl.vue";

const props = defineProps<{
  ticket: TicketDetail | null;
}>();

defineEmits<{
  updated: [];
}>();

const priorityBadgeClass = computed(() => {
  switch (props.ticket?.priority) {
    case "critical": return "bg-red-500/10 text-red-400";
    case "high": return "bg-orange-500/10 text-orange-400";
    case "medium": return "bg-blue-500/10 text-blue-400";
    case "low": return "bg-gray-500/10 text-gray-400";
    default: return "";
  }
});

const fmt = (d: string | undefined) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formattedDueDate = computed(() => {
  if (!props.ticket?.dueAt) return "—";
  return new Date(props.ticket.dueAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
});

const formattedCreated = computed(() => fmt(props.ticket?.createdAt));
const formattedUpdated = computed(() => fmt(props.ticket?.updatedAt));

const reporterInitials = computed(() => {
  const name = props.ticket?.createdBy?.name ?? "";
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
});
</script>
