<template>
  <div>
    <loading v-model:active="isLoading" :can-cancel="true" />
    <div class="main m-3">
      <div class="row">
        <div class="d-flex">
          <button
            :class="isActive ? 'active_btn' : 'inactive_btn'"
            @click="activateState()"
          >
            Admins
          </button>
          <button
            :class="!isActive ? 'active_btn' : 'inactive_btn'"
            @click="inActivateState()"
          >
            Editors
          </button>
        </div>
      </div>

      <div>
        <side-bar ref="childComponent" @loading="afterSave" />
      </div>

      <div class="row">
        <div class="d-flex justify-content-between">
          <input
            type="text"
            style="width: 60%"
            v-model="searchVal"
            v-debounce:300ms="getAllEmployees"
            autocomplete="false"
            @click="clickSearch"
          />
          <button class="btn btn-primary" @click="childComponent.show()">
            Add New
          </button>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in allEmployees" :key="emp">
            <td>{{ emp.firstName }}</td>
            <td>{{ emp.lastName }}</td>
            <td>{{ emp.email }}</td>
            <td>
              <button
                class="btn"
                :class="isActive ? 'btn-danger' : 'btn-success'"
                @click="isActive ? addEditor(emp) : addAdmin(emp)"
              >
                {{ isActive ? "Remove" : "Add" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li
            class="page-item"
            v-for="pageNumber in pageCount"
            :key="pageNumber"
          >
            <a
              class="page-link pill-btn pill-btn1"
              :class="`tab_btn${pageNumber}`"
              @click="setPageNumber(pageNumber)"
              >{{ pageNumber }}</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import { ref, onMounted } from "vue";
import axios from "axios";
import { vue3Debounce } from "vue-debounce";
import sideBar from "./sideBar.vue";
import { useRouter } from "vue-router";

export default {
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  components: {
    sideBar,
    Loading,
  },
  setup() {
    const router = useRouter();
    const isLoading = ref(false);

    const name = "migara";
    const childComponent = ref(null);
    const allEmployees = ref(null);
    const searchVal = ref(null);
    const pageNum = ref(null);
    const pageCount = ref(0);
    const pageSize = ref(10);

    const message = ref(null);
    const debounce = ref(null);

    const isActive = ref(true);

    // side bar show
    const show = () => {
      childComponent.value.show();
    };
    // side bar hide
    const hide = () => {
      childComponent.value.hide();
    };

    // get all users
    const getAllEmployees = () => {
      isLoading.value = true;
      hide();
      const data = {
        pageSize: pageSize.value,
        pageNumber: pageNum.value ? pageNum.value : 1,
        search: searchVal.value,
        active: isActive.value,
      };
      axios.get("emp", { params: data }).then((res) => {
        isLoading.value = false;
        allEmployees.value = res.data.user;
        pageCount.value = Math.ceil(res.data.count / pageSize.value);
      });
    };

    const setPageNumber = (num) => {
      isLoading.value = true;
      pageNum.value = num;
      getAllEmployees();

      /* if (num > 0) {
        const tab = document.getElementsByClassName(`tab_btn${num}`);
        tab[0].classList.add("tab_btn");

        for (let i = 0; i < pageCount.value; i++) {
          if (i != num) {
            const tab = document.getElementsByClassName(`tab_btn${i}`);
            tab[0].classList.remove("tab_btn");
          }
        }
      } */
    };

    const clickSearch = () => {
      pageNum.value = 1;
    };

    const afterSave = () => {
      isLoading.value = true;
      isActive.value = true;
      setPageNumber(1);
    };

    const activateState = () => {
      isActive.value = true;
      setPageNumber(1);
    };
    const inActivateState = () => {
      isActive.value = false;
      setPageNumber(1);
    };

    const addEditor = (user) => {
      if (allEmployees.value.length == 1) {
        setPageNumber(pageNum.value - 1);
      }
      axios
        .delete(`emp/editor/${user._id}`)
        .then(() => {
          getAllEmployees();
        })
        .catch((errs) => {
          console.log(errs);
        });
    };
    const addAdmin = (user) => {
      if (allEmployees.value.length == 1) {
        setPageNumber(pageNum.value - 1);
      }
      axios
        .delete(`emp/admin/${user._id}`)
        .then(() => {
          getAllEmployees();
        })
        .catch((errs) => {
          console.log(errs);
        });
    };

    onMounted(() => {
      getAllEmployees();
      const user = JSON.parse(localStorage.getItem("user")).role;
      if (user !== "admin") {
        router.back();
      }
      // childComponent.value.show();
    });

    return {
      isLoading,
      childComponent,
      allEmployees,
      getAllEmployees,
      clickSearch,
      searchVal,
      pageNum,
      pageCount,
      pageSize,
      message,
      debounce,
      setPageNumber,
      name,
      show,
      hide,
      afterSave,
      isActive,
      activateState,
      inActivateState,
      addEditor,
      addAdmin,
    };
  },
};
</script>

<style scoped>
.pagin_btn {
  background: red !important;
}
.pill-btn {
  border: 1px solid #218af8 !important;
  background-color: #ffffff !important;
  white-space: nowrap;
  width: auto;
  color: #218af8 !important;
  padding: 5px 12px !important;
  margin: 10px 5px;
  font-size: 14px;
  font-weight: 400;
}
.tab_btn {
  border: 1px solid #218af8 !important;
  background-color: #218af8 !important;
  color: #ffffff !important;
}
.active_btn {
  background: none !important;
  outline: none;
  color: red;
  border: 0;
}
.active_btn {
  background: none !important;
  outline: none;
  color: #0d6efd;
  border: 0;
  background-color: rgb(124, 226, 124) !important;
  padding: 12px 24px;
  border-radius: .25rem !important; 
  margin-bottom: 12px;
}
.inactive_btn {
  background: none !important;
  outline: none;
  color: #0d0d0e;
  border: 0;
  padding: 12px 24px;
  margin-bottom: 12px;
}
</style>
