<template>
  <div class="header-menu">
    <nav class="floating-menu options-menu">
      <h3>Menu</h3>
      <HeaderMenuItem item-name="Toggle Inference" :checkbox="true" event-name="toggle-inference" />
      <HeaderMenuItem item-name="Show Performance" :checkbox="true" event-name="show-performance" />
      <HeaderMenuItem item-name="Show Webcam" :checkbox="true" event-name="show-webcam" />
      <HeaderMenuItem item-name="Change Scene" :checkbox="false" event-name="change-scene" />
      <HeaderMenuItem item-name="Calibrate" :checkbox="false" event-name="calibrate" />
    </nav>
  </div>
</template>

</script>

<style scoped>
.header-menu {
  position: fixed;
  top: 6rem;
  right: 10rem;
  z-index: 100;
}

.floating-menu {
  /* width: 50rem; */
  padding: 5px;

  background: #2f333c;

  border-style: solid;
  border-radius: 0.5rem;
  border-color: #e5e5e5;
  border-width: 2px;
}

.options-menu h3 {
  margin: 0 1rem 1.5rem 1rem;
  display: block;

  font-size: 2.5rem;
}
</style>
