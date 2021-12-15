<template>
  <div class="portal-overlay">
    <img src="~/static/portal_left.png" class="left" alt="" />
    <img src="~/static/portal_right.png" class="right" alt="" /> -->
    <img src="~/static/portal_middle.png" class="warp" alt="" />
  </div>
</template>

<style scoped>
.portal-overlay {
  padding: 0px;
  margin: 0px;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  z-index: 5;
}

img {
  position: fixed;

  z-index: 5;
  height: 100%;
  pointer-events: none;
}

img.left {
  top: 0px;
  left: 0px;
}

img.right {
  top:0px;
  right: 0px;
}

img.warp {
  z-index: 4;
  animation: warp;
  animation-iteration-count: infinite;
  animation-duration: 9s;
}

@keyframes warp {
  0% {
    margin-left: -5px;
    margin-top: -3px;
    filter: blur(2px);
    transform: rotate(4deg);
  }

  12.5% {
    margin-left: 4px;
    margin-top: 2px;
    filter: blur(4px);
  }

  25% {
    margin-left: -3px;
    margin-top: -2px;
    filter: blur(2px);
    transform: rotate(-1deg);
  }

  37.5% {
    margin-left: 2px;
    margin-top: 4px;
    filter: blur(0px);
  }

  50% {
    margin-left: -4px;
    margin-top: -2px;
    filter: blur(4px);
    transform: rotate(3deg);
  }

  62.5% {
    margin-left: 5px;
    margin-top: -5px;
    filter: blur(1px);
  }

  75% {
    margin-left: -4px;
    margin-top: 4px;
    filter: blur(6px);
    transform: rotate(1deg);
  }

  87.5% {
    margin-left: 3px;
    margin-top: 3px;
    filter: blur(3px);
  }

  100% {
    margin-left: -2px;
    margin-top: -3px;
    filter: blur(0px);
    transform: rotate(4deg);
  }
}
</style>
