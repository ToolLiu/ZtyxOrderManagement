<template>
  <div class="container">
    <h1>派单管理</h1>
    <table>
      <thead>
        <th>派单编号</th>
        <th>目的地</th>
        <th>需要数量</th>
        <th>运费</th>
        <th>煤种</th>
        <th>二维码</th>
        <th>操作</th>
      </thead>
      <tbody v-for="coalmsg in coalmsgs" :key="coalmsg.id">
        <td>{{ coalmsg.coal_id }}</td>
        <td>{{ coalmsg.destination }}</td>
        <td>{{ coalmsg.requirement }}</td>
        <td>{{ coalmsg.cost }}</td>
        <td>{{ coalmsg.coal_var }}</td>
        <td>
          <div>
            <img
              class="qrcode"
              :src="getImageUrl(coalmsg.coal_QRCode)"
              alt=""
              @click="showImageDialog(getImageUrl(coalmsg.coal_QRCode))"
            />
          </div>
        </td>
        <td>
          <div>
            <button @click="uploadImage(coalmsg.coal_id)">上传二维码</button>
          </div>
        </td>
      </tbody>
    </table>
    <div class="image-dialog" v-if="imageDialog.show">
      <div class="image-dialog-content">
        <button class="close-btn" @click="imageDialog.show = false">X</button>
        <img :src="imageDialog.imageUrl" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UploadQRCode",
  data() {
    return {
      imageDialog: {
        show: false,
        imageUrl: "",
      },
      selectedImage: null,
      coalmsgs: [],
      loading: true,
      coal_id: "",
    };
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) {
        return null;
      }
      // 根据路径生成完整的URL
      const serverRoot = "https://www.crr11.cn/public/QRCode/";
      // console.log(serverRoot+imagePath);
      return serverRoot + imagePath;
    },
    showImageDialog(imageUrl) {
      this.imageDialog.imageUrl = imageUrl;
      this.imageDialog.show = true;
    },
    async uploadImage(coal_id) {
      this.coal_id = coal_id;
      const file = await this.selectImage();
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("coal_id", this.coal_id);
        try {
          await axios.post(
            `${this.$base_url}/coal/uploadCoalQRCode`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("上传成功！");
        } catch (error) {
          console.error("上传失败:", error);
        }
      }
    },
    selectImage() {
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
          const file = event.target.files[0];
          resolve(file);
        };
        input.click();
      });
    },
  },
  mounted() {
    axios
      .get(`${this.$base_url}/coal/admGetCoalMsg`)
      .then((response) => {
        this.coalmsgs = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.loading = false;
      });
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:hover {
  background-color: #f5f5f5;
}

.qrcode {
  height: 150px;
  cursor: pointer;
}

.upload-btn {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

.upload-btn:hover {
  background-color: #45a049;
}

.image-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.image-dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  position: relative;
}

.image-dialog img {
  width: auto; /* 修改此处 */
  height: 900px; /* 修改此处 */
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
</style>
