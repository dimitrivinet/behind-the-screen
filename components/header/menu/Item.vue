<template>
  <div class="headerMenuItem">
    <input
      v-if="checkbox"
      :id="itemName"
      type="checkbox"
      :name="itemName"
      @click="emitEvent"
    />
    <label v-if="checkbox" :for="itemName">{{ itemName }}</label>

    <span v-if="!checkbox" @click="emitEvent">{{ itemName }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { EventBus } from '~/tools/EventBus'

@Component({})
export default class HeaderMenuItem extends Vue {
  @Prop(String) readonly itemName: string | undefined
  @Prop(String) readonly eventName: string | undefined
  @Prop(Boolean) readonly checkbox: boolean | undefined

  emitEvent() {
    EventBus.$emit(this.eventName || '')
  }
}
</script>

<style scoped>
.headerMenuItem {
  padding-right: 3rem;

  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

label,
span {
  margin: 0.5rem 1rem;
  display: block;

  font-size: 2rem;
  font-weight: inherit;

  cursor: pointer;
}
</style>
