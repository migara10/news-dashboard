<template>
  <div
    class="modal fade"
    id="newsModal1"
    tabindex="-1"
    aria-labelledby="newsModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="newsModalLabel">Add News</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- start of the edit box -->
          <div class="edit_box">
            <div class="form-floating mb-3">
              <input type="file" @change="onFileSelected" />
            </div>
            <div class="form-floating mb-3">
              <input
                v-model="user.heading"
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="Heading"
              />
              <label for="floatingInput">Heading</label>
            </div>
            <div class="form-floating mb-3">
              <select
                class="form-select selectpicker"
                aria-label="Default select example"
                v-model="user.category"
              >
                <!-- <option value="sports" selected>Sports</option>
                <option value="tech">Tech</option> -->
                <option v-for="opt in options" :key="opt" :value="opt.value">{{opt.title}}</option>
              </select>
              <!-- <input
                v-model="user.category"
                type="text"
                class="form-control"
                id="floatingPassword"
                placeholder="Category"
              /> -->
              <label for="floatingPassword">Category</label>
            </div>
            <div class="form-floating mb-3">
              <textarea
                v-model="user.content"
                class="form-control text_area"
                placeholder="Content"
                id="floatingTextarea2"
                style="height: 100px"
              />
              <label for="floatingTextarea2">Content</label>
            </div>
          </div>
          <!-- end of the edit box -->
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="refresh()"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="saveNews"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
/* import vSelect from "vue-select";
import "vue-select/dist/vue-select.css"; */
import { useToast } from "vue-toastification";
// import $ from "jquery";
export default {
  components: {
    // vSelect,
  },
  setup(props, context) {
    const toast = useToast();
    const userId = ref(null);
    const theModal = ref();
    const selectedFile = ref(null);
    const options = ref([]);
    const newsData = ref({
      author: "",
      category: "",
      heading: "",
      content: "",
    });
    const user = ref(newsData.value);
    /* const options = ref([
      { title: "Sports", value: "sports" },
      { title: "Tech", value: "tech" },
    ]); */

    // get all news categories
    const getAllCategory = () => {
      axios
        .get("category")
        .then((res) => {
          options.value = res.data.category
        })
        .catch((err) => {
          console.log(err)
        });
    }
    const refresh = () => {
      context.emit("refresh");
    };
    // save image file
    const onFileSelected = (event) => {
      selectedFile.value = event.target.files[0];
      console.log(selectedFile.value);
    };
    // save news
    const saveNews = () => {
      const fd = new FormData();
      fd.append("file", selectedFile.value);
      fd.append("author", user.value.author);
      fd.append("category", user.value.category);
      fd.append("heading", user.value.heading);
      fd.append("content", user.value.content);
      axios
        .post("news", fd)
        .then((res) => {
          console.log(res);
          context.emit("refresh");
        })
        .catch((err) => {
          toast.error(err.response.data.msg, {
            timeout: 2000,
          });
        });
    };
    onMounted(() => {
      getAllCategory();
      userId.value = JSON.parse(localStorage.getItem("user"))._id;
      user.value.author = userId.value;
    });

    return {
      saveNews,
      theModal,
      user,
      newsData,
      refresh,
      userId,
      onFileSelected,
      selectedFile,
      options,
      getAllCategory,
    };
  },
};
</script>

<style lang="scss" scoped>
.text_area {
  height: 200px !important;
}
</style>
