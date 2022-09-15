<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
  },
  setup() {
    return {
    };
  },
};
</script>

<style scoped>
._btn {
  background: none;
  outline: none;
  border: 0;
}
.nav_bar {
  background: rgb(173, 173, 247);
  height: 70px;
}
.router_name {
  text-transform: capitalize;
}
</style>
