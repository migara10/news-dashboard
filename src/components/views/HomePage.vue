<template>
  <div>
    <div class="row p-0 m-0">
      <div class="col-4 col-md-3 col-lg-2 p-0 m-0">
        <nav v-if="!$route.meta.hideNavbar" class="nav flex-column">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link v-if="getUserDetails()" to="/employees" class="nav-link"
            >Employees</router-link
          >
          <router-link v-if="getUserDetails()" to="/category" class="nav-link"
            >Category</router-link
          >
        </nav>
      </div>
      <div class="col-8 col-md-9 col-lg-10 p-0 m-0">
        <div class="row nav_bar p-0 m-0">
          <nav-bar />
          <dash-board v-if="!$route.meta.hideDashBord" />
        </div>
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import NavBar from "./NavBar.vue";
import DashBoard from './News/DashBoard.vue'
export default {
  components: {
    NavBar,
    DashBoard,
  },
  setup() {
    // get logged user details
    const getUserDetails = () => {
      const user = JSON.parse(localStorage.getItem("user")).role;
      return user === "admin" ? true : false;
    };

    onMounted(() => {
    });
    return {
      getUserDetails,
    };
  },
};
NavBar;
</script>
<style scoped>
.nav-link{
  background: none !important;
  outline: none;
  color: #0d6efd;
  border: 0;
  padding: 12px;
}
.router-link-exact-active{
  background: none !important;
  outline: none;
  color: #0d6efd;
  border: 0;
  background-color: rgb(124, 226, 124) !important;
  padding: 12px;
}
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
