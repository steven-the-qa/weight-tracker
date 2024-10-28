<script setup lang="ts">
interface WeightEntry {
  unit: 'lb' | 'kg'
  weight: number
  createdDate: Date
}

const props = defineProps<{
  startWeight: WeightEntry | null
  currentWeight: WeightEntry | null
  goalWeight: WeightEntry | null
  preferredUnit: 'lb' | 'kg'
}>()

const calculateProgress = (): number => {
  if (!props.startWeight || !props.currentWeight || !props.goalWeight) {
    return 0
  }

  // Convert all weights to preferred unit
  const convertWeight = (entry: WeightEntry): number => {
    if (entry.unit === props.preferredUnit) return entry.weight
    return entry.unit === 'kg' ? entry.weight * 2.20462 : entry.weight / 2.20462
  }

  const start = convertWeight(props.startWeight)
  const current = convertWeight(props.currentWeight)
  const goal = convertWeight(props.goalWeight)

  let progress = 0

  // If goal is less than start (losing weight)
  if (goal < start) {
    if (current >= start) return 0 // Regressed beyond start
    if (current <= goal) return 100 // Exceeded goal
    progress = ((start - current) / (start - goal)) * 100
  } 
  // If goal is more than start (gaining weight)
  else {
    if (current <= start) return 0 // Regressed beyond start
    if (current >= goal) return 100 // Exceeded goal
    progress = ((current - start) / (goal - start)) * 100
  }

  // Ensure progress is between 0 and 100
  return Math.min(Math.max(progress, 0), 100)
}
</script>

<template>
  <div class="w-96 h-3 bg-gray-200 rounded-full overflow-hidden">
    <div 
      class="h-full bg-[#2E7EFD] transition-all duration-500 ease-out"
      :style="{ width: `${calculateProgress()}%` }"
    />
  </div>
</template>
