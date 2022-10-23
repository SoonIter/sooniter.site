<script setup>
import { OnClickOutside } from '@vueuse/components'
const props = defineProps({
  show: Boolean,
})
const target = ref(null)
onClickOutside(target, (event) => {

})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" ref="target" class="modal-mask">
      <OnClickOutside flex justify-center items-center @trigger="$emit('close')">
        <slot />
      </OnClickOutside>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
