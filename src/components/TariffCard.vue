<template>
  <div class="tariff-card">
    <p class="title">Basic</p>
    <div class="divider"></div>
    <div class="tariff">
      <div class="price">
        <p>9,99 €</p>
        <p>/ Monat</p>
      </div>
      <div class="divider"></div>
      <div class="infos">
        <div v-for="(value, index) in tariffValues" :key="index" class="info">
          <div class="content">
            <div class="icon-wrapper">
              <img :src="getImage(value.icon)" alt="">
            </div>
            <p>{{ value.unit }}</p>
          </div>
          <div v-if="index < 2" class="divider"></div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="advantages">
        <div v-for="(advantage, index) in advantages" :key="index" class="advantage">
          <div class="icon-wrapper">
            <img :src="getImage('ic_checkmark_white.png')" alt="">
          </div>
          <p>{{ advantage }}</p>
        </div>
      </div>
      <div class="divider"></div>
      <p class="small-info">Keine versteckten Kosten - monatlich kündbar</p>
      <DynamicButton :button-type="ButtonType.Primary" text="Tarif auswählen" :path="Path.Checkout" class="fullWidth"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import {getImage} from "@/utils/ImageUtils.ts";
import {type Ref, ref} from "vue";
import DynamicButton from "@/components/DynamicButton.vue";
import {Path} from "@/utils/PathUtils.ts";
import {ButtonType} from "@/utils/ButtonType.ts";

interface TariffValue {
  icon: string;
  unit: string;
}

const tariffValues: Ref<TariffValue[]> = ref([
  {icon: 'ic_phone.png', unit: '200 Minuten'},
  {icon: 'ic_sms.png', unit: '100 SMS'},
  {icon: 'ic_lte.png', unit: '3 GB LTE'}
]);
const advantages: Ref<string[]> = ref(['Kostenloser Versand', 'Kudensupport 24/7', 'Jederzeit kündbar'])

</script>

<style scoped>

.tariff-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 320px;
  border: 2px solid gray;
  border-radius: 20px;
  box-shadow: 5px 5px 20px 5px lightgray;

  .divider {
    width: 100%;
    height: 1px;
    background-color: lightgray;
  }

  .fullWidth {
    width: 100%;
  }

  .title {
    font-size: 26px;
    font-weight: bold;
    padding: 24px 24px 0;
  }

  .tariff {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 0 24px 24px;
    width: 100%;

    .price {
      display: flex;
      flex-direction: column;
      align-items: center;

      p {
        &:first-of-type {
          font-size: 30px;
          font-weight: bold;
        }

        &:last-of-type {
          font-size: 14px;
        }
      }
    }

    .infos {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      padding: 0 8px;

      .info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;

        .content {
          display: flex;
          align-items: center;
          gap: 8px;

          .icon-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            background: lightgray;
            border-radius: 50%;
            width: 32px;
            height: 32px;

            img {
              width: 22px;
              height: 22px;
            }
          }
        }
      }
    }

    .advantages {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;

      .advantage {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;

        .icon-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          background: darkslategray;
          border-radius: 50%;
          width: 20px;
          height: 20px;

          img {
            width: 14px;
            height: 14px;
          }
        }
      }
    }

    .small-info {
      font-size: 10px;
      color: gray;
      font-style: italic;
    }
  }
}

</style>