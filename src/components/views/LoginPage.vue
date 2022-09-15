<template>
  <div class="vld-parent">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="fullPage"
    />
    <div class="main">
      <div class="content1">
        <div class="header">Login</div>
        <div class="from_class">
          <form class="w-50" autocomplete="off" ref="form1">
            <div class="mb-3">
              <label class="form-label">User Name</label>
              <input type="text" class="form-control" v-model="userName" />
            </div>
            <div class="mb-3">
              <label class="form-label"> Password </label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                v-model="password"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              @click.prevent="login"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  components: {
    Loading,
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const isLoading = ref(false);
    const fullPage = true;
    const userName = ref("migara10");
    const password = ref("123456");

    const login = () => {
      isLoading.value = true;
      const queryParams = {
        userName: userName.value,
        password: password.value,
      };
      axios
        .post("auth/login", queryParams)
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data.validUser));
          isLoading.value = false;
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          toast.success('User Loggin Success', {
            timeout: 2000,
          });
          router.push({ name: "home" });
        })
        .catch((err) => {
          isLoading.value = false;
          toast.error(err.response.data.msg, {
            timeout: 2000,
          });
        });
      /* setTimeout(() => {
        isLoading.value = false;
      }, 1000); */
      userName.value = "";
      password.value = "";
    };
    onMounted(() => {
      localStorage.removeItem('user');
    });
    return {
      isLoading,
      fullPage,
      userName,
      password,
      login,
    };
  },
  /* methods: {
    login() {
      console.log(this.userName, this.password)
    }
  }, */
};
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  .content1 {
    .header {
      margin-top: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 40px;
    }
    .from_class {
      display: flex;
      justify-content: center;
    }
  }
  .btn {
    margin: 0 6px !important;
    &:nth-child(odd) {
      margin: 0 !important;
    }
  }
}
</style>
