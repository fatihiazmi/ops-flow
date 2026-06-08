<template>
  <div class="animate-pulse space-y-6">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
      >
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div class="mt-3 h-8 bg-gray-200 dark:bg-gray-700 rounded w-12" />
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
        <div class="space-y-3">
          <div
            v-for="i in 4"
            :key="i"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <div class="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            </div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
        <div class="space-y-3">
          <div
            v-for="i in 4"
            :key="i"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <div class="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            </div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-4" />
        <div class="space-y-3">
          <div
            v-for="i in 3"
            :key="i"
            class="h-12 bg-gray-200 dark:bg-gray-700 rounded"
          />
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-4" />
        <div class="space-y-3">
          <div
            v-for="i in 3"
            :key="i"
            class="h-12 bg-gray-200 dark:bg-gray-700 rounded"
          />
        </div>
      </div>
    </div>
  </div>
</template>
