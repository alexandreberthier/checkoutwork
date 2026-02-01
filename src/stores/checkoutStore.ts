import {defineStore} from 'pinia'
import {ref, type Ref, watch, computed} from 'vue'
import {doc, setDoc, updateDoc, increment} from 'firebase/firestore'
import { auth } from '@/firebase'

import {db} from '@/firebase'

const localStorageKey = 'checkoutData'

/* ─────────────────────────
   TYPES
───────────────────────── */
type ValidationErrorMap = {
    [step in CheckoutStep]?: {
        [field: string]: number
    }
}

// src/types/checkout.ts
export interface CheckoutStepView {
    validate(): boolean
}


export type CheckoutStep =
    | 'simcard'
    | 'personal'
    | 'delivery'
    | 'payment'
    | 'summary'

export type StepState = 'open' | 'valid' | 'error'

/* ─────────────────────────
   STORE
───────────────────────── */

export const useCheckoutStore = defineStore('checkout', () => {

    // ─────────────────────────
    // FORM DATA
    // ─────────────────────────
    const checkoutSessionId = ref<string | null>(null)

    async function startCheckoutSession() {
        if (checkoutSessionId.value) return

        const user = auth.currentUser
        if (!user) return

        const id = user.uid
        checkoutSessionId.value = id

        checkoutStartedAt.value ??= Date.now()

        await setDoc(
            doc(db, 'checkouts', id),
            {
                startedAt: checkoutStartedAt.value,
                currentStep: currentStep.value,
                stepState: stepState.value,
                validationErrors: validationErrors.value,
                blockedNextAttempts: blockedNextAttempts.value,
            },
            { merge: true }
        )
    }


    // SIM
    const selectedSimType = ref<'sim' | 'esim'>('sim')
    const cardName = ref('')
    const prevPhoneNumber = ref('')
    const prevProvider = ref('')

    // PERSONAL
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const acceptedTerms = ref(false)

    // DELIVERY
    const street = ref('')
    const zip = ref('')
    const country = ref('')
    const differentBilling = ref(false)
    const billingStreet = ref('')

    // PAYMENT
    const paymentMethod = ref<'creditcard' | 'paypal' | ''>('')
    const ccNumber = ref('')
    const ccCvc = ref('')

    // SUMMARY
    const confirmed = ref(false)

    // ─────────────────────────
    // STEPPER
    // ─────────────────────────

    const currentStep = ref<CheckoutStep>('simcard')

    const stepState = ref<Record<CheckoutStep, StepState>>({
        simcard: 'open',
        personal: 'open',
        delivery: 'open',
        payment: 'open',
        summary: 'open'
    })

    function setStepState(step: CheckoutStep, state: StepState) {
        stepState.value[step] = state
    }

    async function goToStep(step: CheckoutStep) {
        currentStep.value = step

        if (!checkoutSessionId.value) return

        await updateDoc(doc(db, 'checkouts', checkoutSessionId.value), {
            currentStep: step
        })
    }


    // ─────────────────────────
    // TRACKING
    // ─────────────────────────

    const checkoutStartedAt = ref<number | null>(null)
    const checkoutFinishedAt = ref<number | null>(null)
    const errorCount = ref(0)
    const validationErrors = ref<ValidationErrorMap>({})

    async function trackValidationError(step: CheckoutStep, field: string) {
        if (!checkoutSessionId.value) return

        // lokal (optional)
        if (!validationErrors.value[step]) validationErrors.value[step] = {}
        validationErrors.value[step]![field] =
            (validationErrors.value[step]![field] ?? 0) + 1

        // Firestore
        await updateDoc(doc(db, 'checkouts', checkoutSessionId.value), {
            [`validationErrors.${step}.${field}`]: increment(1)
        })
    }


    function startCheckout() {
        if (!checkoutStartedAt.value) {
            checkoutStartedAt.value = Date.now()
        }
    }

    async function finishCheckout() {
        checkoutFinishedAt.value = Date.now()

        if (!checkoutSessionId.value) return

        await setDoc(
            doc(db, 'checkouts', checkoutSessionId.value),
            {
                finishedAt: checkoutFinishedAt.value,
                durationMs:
                    checkoutFinishedAt.value - (checkoutStartedAt.value ?? 0)
            },
            { merge: true }
        )
    }



    function trackError() {
        errorCount.value++
    }

    const checkoutDurationMs = computed(() => {
        if (!checkoutStartedAt.value || !checkoutFinishedAt.value) return null
        return checkoutFinishedAt.value - checkoutStartedAt.value
    })

    const checkoutDurationSeconds = computed(() => {
        return checkoutDurationMs.value
            ? Math.round(checkoutDurationMs.value / 1000)
            : null
    })

    const blockedNextAttempts = ref<Record<CheckoutStep, number>>({
        simcard: 0,
        personal: 0,
        delivery: 0,
        payment: 0,
        summary: 0
    })

    async function trackBlockedNextAttempt(step: CheckoutStep) {
        if (!checkoutSessionId.value) return

        blockedNextAttempts.value[step]++

        await updateDoc(doc(db, 'checkouts', checkoutSessionId.value), {
            [`blockedNextAttempts.${step}`]: increment(1)
        })
    }


    // ─────────────────────────
    // LOCAL STORAGE
    // ─────────────────────────

    function getLocalStoreData() {
        const raw = localStorage.getItem(localStorageKey)
        if (!raw) return

        try {
            const d = JSON.parse(raw)

            selectedSimType.value = d.selectedSimType ?? 'sim'
            cardName.value = d.cardName ?? ''
            prevPhoneNumber.value = d.prevPhoneNumber ?? ''
            prevProvider.value = d.prevProvider ?? ''

            firstName.value = d.firstName ?? ''
            lastName.value = d.lastName ?? ''
            email.value = d.email ?? ''
            acceptedTerms.value = d.acceptedTerms ?? false

            street.value = d.street ?? ''
            zip.value = d.zip ?? ''
            country.value = d.country ?? ''
            differentBilling.value = d.differentBilling ?? false
            billingStreet.value = d.billingStreet ?? ''

            paymentMethod.value = d.paymentMethod ?? ''
            ccNumber.value = d.ccNumber ?? ''
            ccCvc.value = d.ccCvc ?? ''

            confirmed.value = d.confirmed ?? false

            currentStep.value = d.currentStep ?? 'simcard'
            stepState.value = d.stepState ?? stepState.value

            checkoutStartedAt.value = d.checkoutStartedAt ?? null
            checkoutFinishedAt.value = d.checkoutFinishedAt ?? null
            errorCount.value = d.errorCount ?? 0
            validationErrors.value = d.validationErrors ?? {}
            blockedNextAttempts.value =
                d.blockedNextAttempts ?? blockedNextAttempts.value


        } catch {
            localStorage.removeItem(localStorageKey)
        }
    }

    watch(
        [
            selectedSimType,
            cardName,
            prevPhoneNumber,
            prevProvider,
            firstName,
            lastName,
            email,
            acceptedTerms,
            street,
            zip,
            country,
            differentBilling,
            billingStreet,
            paymentMethod,
            ccNumber,
            ccCvc,
            confirmed,
            currentStep,
            stepState,
            checkoutStartedAt,
            checkoutFinishedAt,
            errorCount
        ],
        () => {
            localStorage.setItem(localStorageKey, JSON.stringify({
                selectedSimType: selectedSimType.value,
                cardName: cardName.value,
                prevPhoneNumber: prevPhoneNumber.value,
                prevProvider: prevProvider.value,

                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                acceptedTerms: acceptedTerms.value,

                street: street.value,
                zip: zip.value,
                country: country.value,
                differentBilling: differentBilling.value,
                billingStreet: billingStreet.value,

                paymentMethod: paymentMethod.value,
                ccNumber: ccNumber.value,
                ccCvc: ccCvc.value,

                confirmed: confirmed.value,

                currentStep: currentStep.value,
                stepState: stepState.value,

                checkoutStartedAt: checkoutStartedAt.value,
                checkoutFinishedAt: checkoutFinishedAt.value,
                errorCount: errorCount.value,
                validationErrors: validationErrors.value,
                blockedNextAttempts: blockedNextAttempts.value
            }))
        },
        {deep: true}
    )

    getLocalStoreData()
    function finishCheckoutSession() {
        checkoutFinishedAt.value = Date.now()
    }

    function resetCheckout() {
        localStorage.removeItem(localStorageKey)

        // optional: Store-State zurücksetzen
        selectedSimType.value = 'sim'
        cardName.value = ''
        prevPhoneNumber.value = ''
        prevProvider.value = ''

        firstName.value = ''
        lastName.value = ''
        email.value = ''
        acceptedTerms.value = false

        street.value = ''
        zip.value = ''
        country.value = ''
        differentBilling.value = false
        billingStreet.value = ''

        paymentMethod.value = ''
        ccNumber.value = ''
        ccCvc.value = ''

        confirmed.value = false

        currentStep.value = 'simcard'

        stepState.value = {
            simcard: 'open',
            personal: 'open',
            delivery: 'open',
            payment: 'open',
            summary: 'open',
        }

        checkoutStartedAt.value = null
        checkoutFinishedAt.value = null
        errorCount.value = 0
        validationErrors.value = {}
        blockedNextAttempts.value = {
            simcard: 0,
            personal: 0,
            delivery: 0,
            payment: 0,
            summary: 0,
        }

        checkoutSessionId.value = null
    }


    return {
        // data
        selectedSimType,
        cardName,
        prevPhoneNumber,
        prevProvider,
        firstName,
        lastName,
        email,
        acceptedTerms,
        street,
        zip,
        country,
        differentBilling,
        billingStreet,
        paymentMethod,
        ccNumber,
        ccCvc,
        confirmed,

        // stepper
        currentStep,
        stepState,

        // actions
        setStepState,
        goToStep,

        // tracking
        checkoutStartedAt,
        checkoutFinishedAt,
        checkoutDurationSeconds,
        errorCount,
        startCheckout,
        finishCheckout,
        trackError,
        trackValidationError,
        blockedNextAttempts,
        trackBlockedNextAttempt,
        startCheckoutSession,
        finishCheckoutSession,
        resetCheckout
    }
})
