<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import type { ChartConfiguration } from 'chart.js'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase'

Chart.register(...registerables)

interface WeightEntry {
  unit: 'lb' | 'kg'
  weight: number
  createdDate: Date
}

const props = defineProps<{
  entries?: WeightEntry[]
  unit: 'lb' | 'kg'
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart<'line', (number | null)[], unknown> | null>(null)
let updateTimeout: number | null = null
const isDarkMode = ref(document.documentElement.classList.contains('dark'))

const emit = defineEmits<{
  (e: 'updateStart'): void
  (e: 'updateComplete'): void
}>()

const observer = ref<MutationObserver | null>(null)

const fetchWeightEntries = async () => {
  const user = getAuth().currentUser
  if (!user) return []

  const userWeightEntriesRef = collection(db, 'users', user.uid, 'weightEntries')
  const q = query(
    userWeightEntriesRef,
    orderBy('createdDate', 'desc'),
    limit(30)
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    createdDate: doc.data().createdDate.toDate()
  })) as WeightEntry[]
}

const createChart = async (entries: WeightEntry[]) => {
  if (!chartCanvas.value) return

  // Safely destroy previous chart instance
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }

  try {
    // Convert all weights to the current unit of measure
    const convertedEntries = entries.map(entry => ({
      ...entry,
      weight: entry.unit !== props.unit
        ? (entry.unit === 'kg' ? entry.weight * 2.20462 : entry.weight / 2.20462)
        : entry.weight
    }))

    // Sort entries by date
    const sortedEntries = convertedEntries.sort((a, b) => 
      new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
    )

    const labels = sortedEntries.map(entry =>
      new Date(entry.createdDate).toLocaleDateString()
    )
    const data = sortedEntries.map(entry => entry.weight)

    const config: ChartConfiguration<'line', (number | null)[], unknown> = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `Weight (${props.unit})`,
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563'
            }
          },
          tooltip: {
            mode: 'index' as const,
            intersect: false,
            backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            titleColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563',
            bodyColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563',
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
            },
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563',
              callback: function(value) {
                return `${Math.round(Number(value) * 10) / 10} ${props.unit}`
              }
            }
          },
          x: {
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
            },
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563',
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    }

    // Cast the chart instance to any temporarily to bypass the complex type inference
    chartInstance.value = new Chart(chartCanvas.value!, config) as any
  } catch (error) {
    console.error('Error creating chart:', error)
  }
}

const debouncedCreateChart = (entries: WeightEntry[]) => {
  if (updateTimeout) {
    window.clearTimeout(updateTimeout)
  }
  emit('updateStart')
  updateTimeout = window.setTimeout(async () => {
    await createChart(entries)
    emit('updateComplete')
  }, 300)
}

onMounted(async () => {
  const entries = await (props.entries || fetchWeightEntries())
  debouncedCreateChart(entries)
  
  // Create and store observer reference
  observer.value = new MutationObserver(async () => {
    const newDarkMode = document.documentElement.classList.contains('dark')
    if (isDarkMode.value !== newDarkMode) {
      isDarkMode.value = newDarkMode
      const entries = await (props.entries || fetchWeightEntries())
      debouncedCreateChart(entries)
    }
  })
  
  observer.value.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

// Watch for unit changes and update the chart
watch(() => props.unit, async () => {
  const entries = await (props.entries || fetchWeightEntries())
  debouncedCreateChart(entries)
})

// Watch for new entries
watch(() => props.entries, (newEntries) => {
  if (newEntries) {
    debouncedCreateChart(newEntries)
  }
}, { deep: true })

// Clean up
onBeforeUnmount(() => {
  if (updateTimeout) {
    window.clearTimeout(updateTimeout)
  }
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
  // Safely disconnect observer
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }
})
</script>

<template>
  <div class="w-full h-full dark:bg-gray-800 bg-white rounded-lg shadow-lg p-4">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>
