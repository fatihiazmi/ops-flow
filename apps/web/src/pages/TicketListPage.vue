<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tickets</h1>
      <CreateTicketDialog @created="fetchTickets" />
    </div>

    <div class="mb-6 flex flex-wrap gap-4">
      <div>
        <label
          for="search"
          class="block text-sm font-medium text-gray-700"
        >Search</label>
        <input
          id="search"
          :value="filters.q"
          @input="updateQuery({ q: ($event.target as HTMLInputElement).value, page: 1 })"
          type="text"
          placeholder="Search tickets..."
          class="mt-1 block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          for="status"
          class="block text-sm font-medium text-gray-700"
        >Status</label>
        <select
          id="status"
          :value="filters.status"
          @change="updateQuery({ status: ($event.target as HTMLSelectElement).value, page: 1 })"
          class="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label
          for="priority"
          class="block text-sm font-medium text-gray-700"
        >Priority</label>
        <select
          id="priority"
          :value="filters.priority"
          @change="updateQuery({ priority: ($event.target as HTMLSelectElement).value, page: 1 })"
          class="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="text-center py-12"
    >
      <p class="text-gray-500">Loading tickets...</p>
    </div>

    <div
      v-else-if="error"
      class="p-4 bg-red-50 rounded-lg text-red-700"
    >
      <p>{{ error }}</p>
      <button
        @click="fetchTickets"
        class="mt-2 text-sm underline"
      >Retry</button>
    </div>

    <div
      v-else-if="tickets.length === 0"
      class="text-center py-12"
    >
      <p class="text-gray-500">No tickets found.</p>
    </div>

    <div v-else>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assignee
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="ticket in tickets"
            :key="ticket.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="router.push(`/tickets/${ticket.id}`)"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ ticket.title }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ ticket.status }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ ticket.priority }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ ticket.assignee?.name || "Unassigned" }}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="meta"
        class="mt-4 flex items-center justify-between"
      >
        <button
          :disabled="meta.page <= 1"
          @click="updateQuery({ page: meta.page - 1 })"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-700">
          Page {{ meta.page }} of {{ meta.totalPages }} ({{ meta.total }} total)
        </span>
        <button
          :disabled="meta.page >= meta.totalPages"
          @click="updateQuery({ page: meta.page + 1 })"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useTicketList } from "../composables/useTicketList.js";
import CreateTicketDialog from "../components/tickets/CreateTicketDialog.vue";

const router = useRouter();
const { tickets, meta, isLoading, error, filters, fetchTickets, updateQuery } =
  useTicketList();
</script>
