<template>
  <div class="row nav_bar p-0 m-0">
    <div class="d-flex justify-content-between align-items-center">
      <div class="router_name">{{ $route.name }}</div>
      <div class="btn-group">
        <button
          class="dropdown-toggle _btn"
          data-bs-toggle="dropdown"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
        {{getUserDetails()}}
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item" @click="logOut()">LogOut</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const userName = ref("migara");

    // log out dashboard
    const logOut = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.replace("/login");
      userName.value = "user";
    };

    // get logged user details
    const getUserDetails = () => {
     const user = JSON.parse(localStorage.getItem("user")).role;
     return user.charAt(0).toUpperCase() + user.slice(1);
    };

    
    return {
      logOut,
      getUserDetails,
      userName,
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
