<template>
  <div
    class="modal fade"
    id="newsModal"
    tabindex="-1"
    aria-labelledby="newsModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="newsModalLabel">
            {{ canEdit ? "Update News" : "View News" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModel"
          ></button>
        </div>
        <div class="modal-body">
          <!-- start of the edit box -->
          <div class="edit_box">
            <div class="image mb-3">
              <img
                class="_image_size"
                :src="`${baseUrl}/${newsData.imgUri}`"
                alt=""
              />
            </div>
            <div class="form-floating mb-3">
              <input
                v-model="newsData.heading"
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
                v-model="newsData.category"
              >
                <option v-for="opt in options" :key="opt" :value="opt.value">
                  {{ opt.title }}
                </option>
              </select>
              <!-- <input
                v-model="newsData.category"
                type="text"
                class="form-control"
                id="floatingPassword"
                placeholder="Category"
              /> -->
              <label for="floatingPassword">Category</label>
            </div>
            <div class="form-floating mb-3">
              <textarea
                v-model="newsData.content"
                class="form-control text_area"
                placeholder="Content"
                id="floatingTextarea2"
                style="height: 100px"
              />
              <label for="floatingTextarea2">Content</label>
            </div>
            <div class="form-floating mb-3">
              <input
                v-model="newsData.createdAt"
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="Created Date"
              />
              <label for="floatingInput">Created Date</label>
            </div>
            <div class="form-floating mb-3">
              <input
                v-model="newsData.updatedAt"
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="Update Date"
              />
              <label for="floatingInput">Update Date</label>
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
            v-if="canEdit"
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="saveUpdatedNews"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUpdated } from "vue";
import { useToast } from "vue-toastification";
import axios from "axios";
import moment from "moment";
// import { Modal } from "bootstrap";
// import $ from 'jquery'
export default {
  props: {
    userdata: {
      type:Object,
      default:null,
    },
    canedit: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const toast = useToast();
    const theModal = ref();
    const canEdit = ref(false);
    const newsData = ref({});
    const baseUrl = axios.defaults.baseURL;
    const options = ref([]);
    const empty = ref({
      author: "",
      category: "",
      heading: "",
      content: "",
      createdAt: "",
      updatedAt: "",
    });

    // edit news after saved
    const saveUpdatedNews = () => {
      const value = moment(new Date()).format();
      newsData.value.updatedAt = value;
      newsData.value.createdAt = moment(newsData.value.createdAt).format();
      console.log(value);

      axios
        .put(`news/${newsData.value._nId}`, newsData.value)
        .then((res) => {
          toast.success(res.data.msg, {
            timeout: 2000,
          });
          context.emit("refresh");
        })
        .catch((err) => {
          toast.error(err.response.data.msg, {
            timeout: 2000,
          });
        });
    };
    // get all news categories
    const getAllCategory = () => {
      axios
        .get("category")
        .then((res) => {
          options.value = res.data.category;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    // hide popup
    const closeModel = () => {
      newsData.value = empty.value;
    };

    // refresh page
    const refresh = () => {
      context.emit("refresh");
    };
    onMounted(() => {
      getAllCategory();
    });
    onUpdated(() => {
      canEdit.value = props.canedit;
      newsData.value = props.userdata;
      newsData.value.createdAt = moment(
        String(props.userdata.createdAt)
      ).format("MM/DD/YYYY hh:mm a");
      newsData.value.updatedAt = moment(
        String(props.userdata.updatedAt)
      ).format("MM/DD/YYYY hh:mm a");
    });

    return {
      baseUrl,
      saveUpdatedNews,
      closeModel,
      theModal,
      newsData,
      empty,
      refresh,
      canEdit,
      getAllCategory,
      options,
    };
  },
};
</script>

<style lang="scss" scoped>
.text_area {
  height: 200px !important;
}
._image_size {
  width: 100%;
}
</style>
