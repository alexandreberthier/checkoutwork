import {createRouter, createWebHistory} from 'vue-router'
import TariffDetails from "@/views/TariffDetails.vue";
import CheckoutLayout from "@/components/checkout/CheckoutLayout.vue";
import StepSimCardData from "@/components/checkout/StepSimCardData.vue";
import StepPersonalData from "@/components/checkout/StepPersonalData.vue";
import StepDeliveryData from "@/components/checkout/StepDeliveryData.vue";
import StepPaymentData from "@/components/checkout/StepPaymentData.vue";
import StepSummaryData from "@/components/checkout/StepSummaryData.vue";
import Thanks from "@/views/Thanks.vue";
import AdminView from "@/views/AdminView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: TariffDetails
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminView
        },
        {
            path: '/checkout',
            component: CheckoutLayout,
            name: 'checkout',
            redirect: '/checkout/simcard',
            children: [
                {
                    path: 'simcard',
                    name: 'simcard',
                    component: StepSimCardData
                },
                {
                    path: 'personal',
                    name: 'personal',
                    component: StepPersonalData
                },
                {
                    path: 'delivery',
                    name: 'delivery',
                    component: StepDeliveryData
                },
                {
                    path: 'payment',
                    name: 'payment',
                    component: StepPaymentData
                },
                {
                    path: 'summary',
                    name: 'summary',
                    component: StepSummaryData
                }
            ]
        },
        {
            path: '/thanks',
            name: 'thanks',
            component: Thanks
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }

        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth'
            }
        }

        return {
            left: 0,
            top: 0
        }
    }

})

export default router
