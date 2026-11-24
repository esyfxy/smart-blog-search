<template>
    <div style="margin:20px 0;">
      <div v-if="orderStatus === 'pending'">
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column" v-if="qrCodeUrl">
          <span><p>订单号：{{ orderId }}</p></span>
          <div style="margin:auto"><p>请使用支付宝扫码支付</p></div>
          <img :src="qrCodeUrl" alt="Order QR Code" style="margin:auto" />
          <proButton :info="'已支付'"
              @click.native="checkOrderStatus"
              :before="$constant.before_color_2"
              :after="$constant.after_color_2">
          </proButton>
        </div>
      </div>
      <div v-else-if="orderStatus === 'SUCCESS'">
        <p>订单已支付</p>
        <div>隐藏内容：<div v-html="productDescription"></div></div>
      </div>
      <div  v-else style="display: flex; justify-content: center; align-items: center; flex-direction: row">
        {{ isLogin?'付费解锁文章 ':'登录后可购买文章' }}
        <proButton v-if="isLogin" style="display:inline-block" :info="'生成订单'"
            @click.native="generateOrder"
            :before="$constant.before_color_2"
            :after="$constant.after_color_2">
        </proButton>
      </div>
    </div>
  </template>
  
  <script>
import { useMainStore } from '../../store';
import axios from 'axios';
import { queryOrderStatus, createOrder } from '../../utils/api';
import QRCode from 'qrcode';
import proButton from "./proButton.vue";

export default {
  components: {
    proButton
  },
  props: {
    productDescription: {
      type: String,
      required: false,
    },
    productCode: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    }
  },
  setup() {
    const store = useMainStore();
    return { store };
  },
  
data() {
    return {
      orderStatus: null,
      qrCodeUrl: '',
      orderId:'',
      isAllowPay:false,
    };
  },
  computed: {
    userId() {
      console.log(this.store.currentUser,this.store.currentUser.id);
      return this.store.currentUser.id;
    },
    isLogin(){
      return !this.$common.isEmpty(this.store.currentUser)
    }
  },
  methods: {
      // 开始的获得
    async selectOrders(productCode) {
      const response = await axios.post('/trade/order/select', {
        productCode: productCode + '/'+ this.userId,
        userId: this.userId,
        orderStatus:"SUCCESS"
      });
      
      if (response.data.data[0].orderStatus == "SUCCESS") {
        console.log("订单已支付");
        this.orderStatus = 'SUCCESS';
      } else {
        this.isAllowPay = true;
        // this.generateOrder();
      }
    },
    async generateOrder() {
      if(!this.userId) {
        alert("请先登录")
        return;
      }
      const response = await axios.post('/trade/order/createOrder', {
        productCode: this.productCode +'/'+ this.userId,
        userId: this.userId,
        productDescription:this.productDescription,
        amount: this.amount,
      });
      if (response.data.code == 200) {
        this.orderId = response.data.data.orderId;
        this.qrCodeUrl = await QRCode.toDataURL(decodeURIComponent(response.data.data.code_url));
        this.orderStatus = 'pending';
        this.isAllowPay = true;
        setTimeout(() => {
          this.checkOrderStatus();
        }, 25000);
      }
    },
    async checkOrderStatus() {
      const response = await axios.get('/trade/order/query', {
        params: {
          orderId:this.orderId
        }
      });
      if (response.data.data && response.data.data.orderStatus === 'SUCCESS') {
        this.orderStatus = 'SUCCESS';
        this.isAllowPay = false;
      } else {
        alert('订单未支付，请手动点击已支付');
      }
    },
  },
  mounted() {
    this.selectOrders(this.productCode);
  },
};
</script>
  
<style scoped>
/* 添加一些简单的样式 */
img {
  width: 200px;
  height: 200px;
}
button {
  margin-top: 20px;
}
</style>
  