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
            <label for="position">*坐标(点击地图即可自动获取):</label>
            <input type="text" id="position" v-model="form.position" required/>
          </div>
          <button type="submit" class="submit-btn">添加到派单表</button>
        </form>
      </div>
      <div class="map-container">
        <div class="serch-container">
          <input type="text" class="map-search" v-model="address" /> 
          <button @click="searchAddress" class="map-search-btn">搜索</button>
        </div>
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
      myLat: "",
      myLng: "",
      map: null,
      markerLayer: null,
      address: "",
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
    searchAddress(){
      let positionUrl = "/mapapi/ws/place/v1/search";
      let keyword = this.address;
      axios
        .get(`${positionUrl}?key=4RXBZ-J72RU-6GOVE-GMNUS-5PS7S-NRFKB&keyword=${keyword}&boundary=nearby(${this.myLat},${this.myLng},5000,1)`)
        .then((response) => {
          let res = response.data.data;
          let lat0 = res[0].location.lat;
          let lng0 = res[0].location.lng;
          let center = new TMap.LatLng(lat0, lng0);
          this.map.panTo(center)
          for(let i =0; i<res.length;i++){
            console.log(res[i]);
            this.markerLayer.remove(`${i}`)
            this.markerLayer.add([
              {
                id: `${i}`,
                position: new TMap.LatLng(res[i].location.lat, res[i].location.lng),
              },
            ]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  },
  mounted() {
    // var center = new TMap.LatLng(22.597920,113.841059) //  固戍
    let positionUrl = "/mapapi/ws/location/v1/ip";
    axios
      .get(`${positionUrl}?key=4RXBZ-J72RU-6GOVE-GMNUS-5PS7S-NRFKB`)
      .then((response) => {
        this.myLat = response.data.result.location.lat;
        this.myLng = response.data.result.location.lng;
        const center = new TMap.LatLng(this.myLat, this.myLng);
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
  width: 80vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.content-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.form-container {
  flex: 2;
  padding: 20px;
}

form {
  width: 100%;
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
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

.map-container {
  flex: 7;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.serch-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.map-search {
  flex: 8;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.map-search-btn {
  flex: 2;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-left: 10px;
}

#map {
  width: 100%;
  height: 500px;
}
</style>

