<template>
  <div>
    <loading v-model:active="isLoading" :can-cancel="true" />

    <div class="form border p-3 mt-4" style="width: 60%">
      <h3>Add New Category</h3>
      <!-- start of the edit box -->
      <div class="edit_box">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            v-model="categoryValue"
            id="floatingInput"
            placeholder="Heading"
          />
          <label for="floatingInput">Enter New Category type</label>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="reset()"
      >
        Clear
      </button>
      <button
        type="button"
        class="btn btn-primary m-2"
        data-bs-dismiss="modal"
        @click="addCategories()"
      >
        Save
      </button>
      <!-- end of the edit box -->
    </div>
    <div class="main m-5">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Value</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cat, index) in allCategories" :key="index">
            <th class="align-middle" scope="row">{{ index + 1 }}</th>
            <td class="align-middle">{{ cat.title }}</td>
            <td class="align-middle">{{ cat.value }}</td>
            <td>
              <button class="btn btn-danger" @click="removeCategory(cat._cId)">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import { ref, onMounted } from "vue";
import axios from "axios";
import { vue3Debounce } from "vue-debounce";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  components: {
    Loading,
  },
  setup() {
    const toast = useToast();
    const router = useRouter();
    const isLoading = ref(false);
    const allCategories = ref(null);
    const debounce = ref(null);

    const isActive = ref(true);
    const categoryValue = ref("");

    // get all category
    const getAllCategory = () => {
      isLoading.value = true;
      axios.get("category").then((res) => {
        isLoading.value = false;
        allCategories.value = res.data.category;
      });
    };

    // add new category
    const addCategories = () => {
      const data = {
        value: categoryValue.value.toLowerCase(),
      };
      axios
        .post("category", data)
        .then((res) => {
          getAllCategory();
          reset();
          toast.success(res.data.msg, {
            timeout: 2000,
          });
        })
        .catch((err) => {
          toast.error(err.response.data.msg, {
            timeout: 2000,
          });
        });
    };
    // remove category
    const removeCategory = (value) => {
      axios
        .delete(`category/${value}`)
        .then((res) => {
          getAllCategory();
          toast.success(res.data.msg, {
            timeout: 2000,
          });
        })
        .catch((err) => {
          toast.error(err.response.data.msg, {
            timeout: 2000,
          });
        });
    };

    //reset data
    const reset = () => {
      categoryValue.value = "";
    };

    onMounted(() => {
      getAllCategory();
      const user = JSON.parse(localStorage.getItem("user")).role;
      if (user !== "admin") {
        router.back();
      }
    });

    return {
      isLoading,
      allCategories,
      getAllCategory,
      debounce,
      isActive,
      addCategories,
      removeCategory,
      categoryValue,
      reset,
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
}
.inactive_btn {
  background: none !important;
  outline: none;
  color: #0d0d0e;
  border: 0;
}
</style>
