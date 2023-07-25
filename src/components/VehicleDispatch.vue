<template>
  <div class="container">
    <h1>添加派单信息</h1>
    <div class="content-container">
      <div class="form-container">
        <form @submit.prevent="addCoalMsg">
          <div class="form-group">
            <label for="destination">*目的地:</label>
            <input
              type="text"
              id="destination"
              v-model="form.destination"
              required
            />
          </div>
          <div class="form-group">
            <label for="quantity">*数量:</label>
            <input
              type="number"
              id="quantity"
              v-model="form.requirement"
              required
            />
          </div>
          <div class="form-group">
            <label for="shippingFee">*运费:</label>
            <input
              type="number"
              id="shippingFee"
              v-model="form.cost"
              required
            />
          </div>
          <div class="form-group">
            <label for="coalType">*煤种:</label>
            <input type="text" id="coalType" v-model="form.coal_var" required />
          </div>
          <div class="form-group">
            <label for="cipher">验证信息(普通派单勿填):</label>
            <input type="text" id="cipher" v-model="form.cipher"/>
          </div>
          <div class="form-group">
            <label for="position">*坐标(勿手动填写，请点击地图获取):</label>
            <input type="text" id="position" v-model="form.position" required/>
          </div>
          <button type="submit" class="submit-btn">添加到派单表</button>
        </form>
      </div>
      <div class="map-container">
        <input type="text" class="map-search" /> <button>搜索</button>
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {
  data() {
    return {
      form: {
        destination: "",
        quantity: "",
        coalType: "",
        cost: "",
        position: "",
      },
      map: null,
      markerLayer: null,
    };
  },
  methods: {
    async addCoalMsg() {
      const response = await fetch(`${this.$base_url}/coal/addCoalMsg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.form),
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "添加成功",
          showConfirmButton: false,
          timer: 2000,
        });
        this.form = {
          destination: "",
          quantity: "",
          coalType: "",
          cost: "",
          position: "",
        };
        const result = await response.json();
        console.log(result);
        // 这里可以进行后续操作，如显示提示信息或清除表单数据
      } else {
        console.error("提交数据失败");
      }
    },
    clickHandler(evt) {
      var lat = evt.latLng.getLat().toFixed(6);
      var lng = evt.latLng.getLng().toFixed(6);
      this.$set(this.form, "position", lat + "," + lng);
      
      this.markerLayer.updateGeometries([
        {
          id: "position",
          position: new TMap.LatLng(lat, lng),
        },
      ]);
    },
  },
  mounted() {
    // var center = new TMap.LatLng(22.597920,113.841059) //  固戍
    let positionUrl = "/mapapi/ws/location/v1/ip";
    axios
      .get(`${positionUrl}?key=4RXBZ-J72RU-6GOVE-GMNUS-5PS7S-NRFKB`)
      .then((response) => {
        let lat = response.data.result.location.lat;
        let lng = response.data.result.location.lng;
        const center = new TMap.LatLng(lat, lng);
        //定义map变量，调用 TMap.Map() 构造函数创建地图
        this.map = new TMap.Map(document.getElementById("map"), {
          center: center, //设置地图中心点坐标
          zoom: 14.2, //设置地图缩放级别
          viewMode: "2D",
          // pitch: 43.5,  //设置俯仰角
          // rotation: 45    //设置地图旋转角度
        });
        this.markerLayer = new TMap.MultiMarker({
          id: 'selectedPoint',
          map: this.map, //指定地图容器
          //样式定义
          // styles: {
          //     //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
          //     "myStyle": new TMap.MarkerStyle({
          //         "width": 35,  // 点标记样式宽度（像素）
          //         "height": 35, // 点标记样式高度（像素）
          //         "src": '../img/marker.png',  //图片路径
          //         //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
          //         "anchor": { x: 16, y: 32 }
          //     })
          // },
          //点标记数据数组
          // geometries: [{
          //     "id": "position",   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
          //     // "styleId": 'myStyle',  //指定样式id
          //     "position": new TMap.LatLng(22.542377,114.058451),  //点标记坐标位置
          //     "properties": {//自定义属性
          //         "title": "标记"
          //     }
          // }]
        });
        this.map.on("click", this.clickHandler);
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%; /* 使容器高度占据整个视口 */
  width: 100%;
}

.form-container {
  display: flex;
  justify-content: center;
  width: 30%;
}

form {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  border-radius: 5px;
  background-color: #f2f2f2;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

h1 {
  position: absolute;
  top: 28px;
  left: 230px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
}

input {
  width: 300px;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 16px;
  outline: none;
  background-color: #fff;
  box-shadow: inset 0 0 0 1px #ccc;
  transition: box-shadow 0.3s;
}

input:focus {
  box-shadow: inset 0 0 0 1px #007bff;
}

.submit-btn {
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 20px;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #0056b3;
}
.map-container {
}
#map {
  display: inline-block;
  width: 80%;
  height: 500px;
  border: #0056b3 solid 2px;
  border-radius: 7px;
  overflow: hidden;
}
.content-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 80px; /* 这是元素之间的间距 */
}
.map-search {
}
</style>
