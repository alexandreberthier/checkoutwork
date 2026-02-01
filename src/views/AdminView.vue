<template>
  <SiteLayout heading="Checkout Analytics">
    <div class="analytics">
      <div v-if="loading">Lade Daten…</div>

      <table v-else>
        <thead>
        <tr>
          <th>Session</th>
          <th>Start</th>
          <th>Aktueller Step</th>
          <th>Blockierte Klicks</th>
          <th>Validierungsfehler</th>
          <th>Dauer (Sek)</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="checkout in checkouts" :key="checkout.id">
          <td>{{ checkout.id.slice(0, 8) }}</td>
          <td>{{ formatDate(checkout.startedAt) }}</td>
          <td>{{ checkout.currentStep }}</td>
          <td>{{ sumBlocked(checkout.blockedNextAttempts) }}</td>
          <td>{{ sumValidation(checkout.validationErrors) }}</td>
          <td>
            {{ checkout.durationMs
              ? Math.round(checkout.durationMs / 1000)
              : '-' }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </SiteLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import SiteLayout from '@/components/layouts/SiteLayout.vue'

type CheckoutDoc = {
  id: string
  startedAt?: number
  finishedAt?: number
  durationMs?: number
  currentStep?: string
  blockedNextAttempts?: Record<string, number>
  validationErrors?: Record<string, Record<string, number>>
}


const loading = ref(true)
const checkouts = ref<CheckoutDoc[]>([])

onMounted(async () => {
  const snap = await getDocs(collection(db, 'checkouts'))

  checkouts.value = snap.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<CheckoutDoc, 'id'>)
  }))

  loading.value = false
})

function formatDate(ts?: number) {
  if (!ts) return '-'
  return new Date(ts).toLocaleString()
}

function sumBlocked(blocked?: Record<string, number>) {
  if (!blocked) return 0
  return Object.values(blocked).reduce((a, b) => a + b, 0)
}

function sumValidation(errors?: Record<string, Record<string, number>>) {
  if (!errors) return 0
  return Object.values(errors)
      .flatMap(fields => Object.values(fields))
      .reduce((a, b) => a + b, 0)
}
</script>

<style scoped>
.analytics {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

thead {
  background: #f5f5f5;
  font-weight: 600;
}
</style>


