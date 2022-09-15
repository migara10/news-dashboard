<template>
  <div>
    <loading v-model:active="isLoading" :can-cancel="true" />
    <div class="main m-3">
      <div class="row">
        <div class="d-flex mb-3">
          <button
            :class="isActive ? 'active_btn' : 'inactive_btn'"
            @click="published()"
          >
            Published
          </button>
          <button
            :class="!isActive ? 'active_btn' : 'inactive_btn'"
            @click="unPublished()"
          >
            Unpublished
          </button>
        </div>
      </div>

      <div class="row">
        <div class="d-flex justify-content-between">
          <input
            type="text"
            style="width: 60%"
            v-model="searchVal"
            v-debounce:300ms="getAllNews"
            autocomplete="false"
            @click="clickSearch"
          />
          <button
            class="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#newsModal1"
          >
            Add New
          </button>
        </div>
      </div>
      <div class="main-boody">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Author Id</th>
              <th scope="col">Image</th>
              <th scope="col">Category</th>
              <th scope="col">Heading</th>
              <th scope="col">Content</th>
              <th scope="col">View</th>
              <th scope="col">Edit</th>
              <th scope="col">Published</th>
            </tr>
          </thead>
          <tbody v-for="news in allNews" :key="news">
            <tr>
              <th class="align-middle">{{ news.author }}</th>
              <th class="align-middle">
                <img
                  class="_image_size"
                  :src="`${baseUrl}/${news.imgUri}`"
                  alt=""
                />
              </th>
              <td class="align-middle">{{ news.category }}</td>
              <td class="align-middle">{{ news.heading }}</td>
              <td class="align-middle">{{ news.content.slice(0, 20) }}...</td>
              <td class="align-middle">
                <button
                  class="btn btn-info"
                  style="margin-right: 10px"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#newsModal"
                  @click="editNews(news, false)"
                >
                  View
                </button>
              </td>
              <td class="align-middle">
                <button
                  class="btn btn-warning"
                  style="margin-right: 10px"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#newsModal"
                  @click="editNews(news, true)"
                >
                  Edit
                </button>
              </td>
              <td class="align-middle">
                <button
                  class="btn"
                  :class="isActive ? 'btn-danger' : 'btn-success'"
                  @click="isActive ? addEditor(news) : addAdmin(news)"
                >
                  {{ isActive ? "Unpublished" : "Published" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
      <!-- Modal -->
      <add-model @refresh="getAllNews" />
      <edit-model
        :userdata="selectedNews"
        :canedit="canEdit"
        @refresh="getAllNews"
      />
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import { ref, onMounted } from "vue";
import axios from "axios";
import { vue3Debounce } from "vue-debounce";
import AddModel from "./DashBoaedAddModel.vue";
import EditModel from "./DashBoardEditModel.vue";

export default {
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  components: {
    AddModel,
    EditModel,
    Loading,
  },
  setup() {
    const baseUrl = axios.defaults.baseURL;
    // const router = useRouter();
    const isLoading = ref(false);
    const selectedNews = ref({});
    const canEdit = ref(false);
    const allNews = ref(null);
    const searchVal = ref(null);
    const pageNum = ref(null);
    const pageCount = ref(0);
    const pageSize = ref(10);

    const message = ref(null);
    const debounce = ref(null);

    const isActive = ref(true);

    // get all users
    const getAllNews = () => {
      isLoading.value = true;
      const data = {
        pageSize: pageSize.value,
        pageNumber: pageNum.value ? pageNum.value : 1,
        search: searchVal.value,
        active: isActive.value,
      };
      axios.get("news", { params: data }).then((res) => {
        isLoading.value = false;
        allNews.value = res.data.news;
        pageCount.value = Math.ceil(res.data.count / pageSize.value);
      });
    };

    const editNews = (news, state) => {
      selectedNews.value = news;
      canEdit.value = state;
    };

    // set Page Number
    const setPageNumber = (num) => {
      isLoading.value = true;
      pageNum.value = num;
      getAllNews();

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


    const published = () => {
      isActive.value = true;
      setPageNumber(1);
    };
    const unPublished = () => {
      isActive.value = false;
      setPageNumber(1);
    };

    const addEditor = (user) => {
      if (allNews.value.length == 1) {
        setPageNumber(pageNum.value - 1);
      }
      axios
        .delete(`news/unpublish/${user._nId}`)
        .then(() => {
          getAllNews();
        })
        .catch((errs) => {
          console.log(errs);
        });
    };
    const addAdmin = (user) => {
      if (allNews.value.length == 1) {
        setPageNumber(pageNum.value - 1);
      }
      axios
        .delete(`news/publish/${user._nId}`)
        .then(() => {
          getAllNews();
        })
        .catch((errs) => {
          console.log(errs);
        });
    };

    onMounted(() => {
      getAllNews();
    });

    return {
      baseUrl,
      isLoading,
      allNews,
      getAllNews,
      clickSearch,
      searchVal,
      pageNum,
      pageCount,
      pageSize,
      message,
      debounce,
      setPageNumber,
      // afterSave,
      isActive,
      published,
      unPublished,
      addEditor,
      addAdmin,
      // addNews,
      editNews,
      selectedNews,
      canEdit,
    };
  },
};
</script>

<style scoped>
._image_size {
  width: 100px;
  height: 50px;
}
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
  color: #0d6efd;
  border: 0;
  background-color: rgb(124, 226, 124) !important;
  padding: 12px 24px;
  border-radius: .25rem !important;
}
.inactive_btn {
  background: none !important;
  outline: none;
  color: #0d0d0e;
  border: 0;
  padding: 12px 24px;
}
</style>
