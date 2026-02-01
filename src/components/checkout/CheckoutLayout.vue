<template>
  <SiteLayout heading="Checkout">
    <div class="checkout-wrapper">
      <CheckoutStepper
          :current-step="currentStep"
          :step-state="stepState"
      />
      <RouterView v-slot="{ Component }">
        <component :is="Component" ref="stepRef" />
      </RouterView>

      <div class="buttons">
        <DynamicButton
            :button-type="ButtonType.Primary"
            text="Weiter"
            @click="goNext"
        />

        <DynamicButton
            :button-type="ButtonType.Secondary"
            text="Zurück"
            @click="goBack"
            :disabled="currentStep === 'simcard'"
        />
      </div>

    </div>
  </SiteLayout>
</template>

<script setup lang="ts">
import SiteLayout from "@/components/layouts/SiteLayout.vue";
import CheckoutStepper from "@/components/checkout/CheckoutStepper.vue";
import DynamicButton from "@/components/DynamicButton.vue";
import { ButtonType } from "@/utils/ButtonType.ts";
import { signInAnonymously } from 'firebase/auth'
import { auth } from '@/firebase'

import {type CheckoutStep, type CheckoutStepView, useCheckoutStore} from "@/stores/checkoutStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import {onMounted, ref} from "vue";

const checkout = useCheckoutStore();
const { currentStep, stepState } = storeToRefs(checkout);

const router = useRouter();

/* 👉 WICHTIG */
const stepRef = ref<CheckoutStepView | null>(null);

const steps: readonly CheckoutStep[] = [
  "simcard",
  "personal",
  "delivery",
  "payment",
  "summary",
];

function goNext() {
  const current = currentStep.value
  if (!current) return

  // Validierung
  if (stepRef.value?.validate && !stepRef.value.validate()) {
    checkout.trackBlockedNextAttempt(current)
    return
  }

  // 🏁 LETZTER STEP
  if (current === 'summary') {
    checkout.finishCheckoutSession()
    checkout.resetCheckout()
    router.push('/thanks')
    return
  }

  // ➡️ normaler Step-Wechsel
  const index = steps.indexOf(current)
  const nextStep = steps[index + 1]
  if (!nextStep) return

  checkout.goToStep(nextStep)
  router.push(`/checkout/${nextStep}`)
}



function goBack() {
  const current = currentStep.value;
  if (!current) return;

  const index = steps.indexOf(current);
  if (index <= 0) return;

  const prevStep = steps[index - 1];
  if (!prevStep) return;

  // Optional: aktuellen Step zurücksetzen
  checkout.setStepState(current, 'open');

  checkout.goToStep(prevStep);
  router.push(`/checkout/${prevStep}`);
}

onMounted(async () => {
  await signInAnonymously(auth)
  await checkout.startCheckoutSession()
})


</script>



<style scoped>

.checkout-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
