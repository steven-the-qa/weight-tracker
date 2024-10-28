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

const emit = defineEmits<{
  (e: 'updateStart'): void
  (e: 'updateComplete'): void
}>()

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
          },
          tooltip: {
            mode: 'index' as const,
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return `${Math.round(Number(value) * 10) / 10} ${props.unit}`
              }
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    }

    chartInstance.value = new Chart(
      chartCanvas.value as HTMLCanvasElement,
      config as ChartConfiguration<'line', number[], string>
    )
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
  const entries = props.entries || await fetchWeightEntries()
  debouncedCreateChart(entries)
})

// Watch for unit changes and update the chart
watch(() => props.unit, async () => {
  const entries = props.entries || await fetchWeightEntries()
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
})
</script>

<template>
  <div class="w-full h-full bg-white rounded-lg shadow-lg p-4">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>
