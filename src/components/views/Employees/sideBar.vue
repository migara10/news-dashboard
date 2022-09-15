<template>
  <div id="side_bar" class="hide1 p-2">
    <div class="header">
      <h6 class="m-0 p-1">Add New User</h6>
      <img :src="imgPath" alt="" class="_close_btn" @click="hide" />
    </div>
    <hr class="mt-0" />
    <div class="form">
      <form action="">
        <div class="_row_item">
          <label for="">First Name</label>
          <input
            class="_input"
            type="text"
            autocomplete="off"
            v-model="user.firstName"
          />
        </div>
        <div class="_row_item">
          <label for="">Last Name</label>
          <input
            class="_input"
            type="text"
            autocomplete="off"
            v-model="user.lastName"
          />
        </div>
        <div class="_row_item">
          <label for="">User Name</label>
          <input
            class="_input"
            type="text"
            autocomplete="off"
            v-model="user.userName"
          />
        </div>
        <div class="_row_item">
          <label for="">Role</label>
          <v-select
            label="title"
            class="_input1 mySelect"
            :options="options"
            :reduce="(role) => role.value"
            :clearable="false"
            v-model="user.role"
          />
        </div>
        <div class="_row_item">
          <label for="">Email</label>
          <input
            class="_input"
            type="email"
            autocomplete="off"
            v-model="user.email"
          />
        </div>
        <div class="_row_item">
          <label for="">Password</label>
          <input
            class="_input"
            type="password"
            autocomplete="off"
            v-model="user.password"
          />
        </div>
      </form>
    </div>
    <button class="_btn1 btn btn-primary" @click="saveNewuser()">Save</button>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { useToast } from "vue-toastification";

export default {
  components: {
    vSelect,
  },
  setup(props, context) {
    const toast = useToast();

    const countries = [];
    const data = "aaa";
    const selected = ref([]);
    const options = [
      { title: "Admin", value: "admin" },
      { title: "Editor", value: "editor" },
    ];
    const emptyUser = ref({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      role: "",
      isDeleted: true,
      clock: {
        clockIn: false,
        clockout: false,
      },
    });

    // side bar show
    const show = () => {
      var sideBar = document.getElementById("side_bar");
      sideBar.classList.add("show");
      sideBar.classList.remove("hide");
      sideBar.classList.remove("hide1");
    };
    // side bar hide
    const hide = () => {
      var sideBar = document.getElementById("side_bar");
      sideBar.classList.add("hide");
      sideBar.classList.remove("show");
      setTimeout(() => {
        sideBar.classList.add("hide1");
      }, 260);
    };

    const user = ref(emptyUser.value);

   
  // new user saved
    const saveNewuser = () => {
      axios
        .post("emp", user.value)
        .then((res) => {
          toast.success(res.data.msg, {
            timeout: 2000,
          });
          hide();
          context.emit('loading')
        })
        .catch((err) => {
          toast.error(err.response.data.msg, {
            timeout: 2000,
          });
        });
    };
    onMounted(() => {
      user.value.role = options[0].value;
    });

    return {
      data,
      emptyUser,
      user,
      saveNewuser,
      options,
      countries,
      selected,
      show,
      hide,
      toast,
      imgPath: require("../../../assets/img/close.png"),
    };
  },
};
</script>

<style scoped>
#side_bar {
  animation-timing-function: linear;
  height: 100%;
  background: rgb(217, 216, 216);
  width: 300px;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 999;
}
.show {
  display: block;
  animation: mymove 0.3s;
}
@keyframes mymove {
  from {
    right: -300px;
  }
  to {
    right: 0px;
  }
}
.hide {
  animation: mymove1 0.3s;
}
@keyframes mymove1 {
  from {
    right: 0px;
  }
  to {
    right: -300px;
  }
}
.hide1 {
  display: none;
}
</style>
<style lang="scss" scoped>
.form {
  ._row_item {
    margin-top: 6px;
    display: flex;
    justify-content: space-between;
    ._input {
      width: 200px;
      outline: none;
    }
    .v-select {
      width: 200px;
      outline: none;
      border-radius: 0px !important;
    }
  }
}
.header {
  display: flex;
  justify-content: space-between;
  ._close_btn {
    width: 10px;
    height: 10px;
  }
}
</style>
<style>
.v-menu__content {
  border-radius: 10px !important;
}
.vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  background: #ffffff;
  border: 1px solid;
  border-radius: 0;
  color: rgb(118, 118, 118);
}
</style>
