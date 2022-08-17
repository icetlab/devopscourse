<template>
  <div class="orders">
    <h1>Confirm Order</h1>
    <b-list-group class = "box">
      <order-item v-for="order in filteredOrders" :key="order._id" :order="order"></order-item>
    </b-list-group>
    <b-container>
      <b-row>
        <b-col cols="12" class="box">
          <b-form-group
                id="button-group"
                description="Once you confirm your order, your cart will be cleared">
            <b-button class="button" variant="outline-secondary" type="button" style="margin-right: 10px" @click="clearOrder()">Clear Cart</b-button>
            <b-button class="button" type="button" @click="confirmOrder()">Confirm total: {{this.total}}kr </b-button>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Api } from '@/Api'
import OrderItem from '@/components/OrderItem'

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      products: [],
      filterStatus: 'Pending',
      confirmedStatus: 'Confirmed',
      total: 0
    }
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        return order.orderStatus.toLowerCase().indexOf(this.filterStatus.toLowerCase()) > -1
      })
    }
  },
  mounted() {
    this.getOrders()
    this.getProducts()
  },
  methods: {
    pendingOrder() {
      return this.orders.findIndex(order => order.orderStatus.toLowerCase() === this.filterStatus.toLowerCase())
    },
    findProduct(productName) {
      return this.products.find(product => product.name === productName)
    },
    getOrders() {
      Api.get('orders')
        .then(response => {
          this.orders = response.data.orders
          var pendingOrder = this.pendingOrder()
          if (pendingOrder !== -1) { // If there is a pending Order
            this.total = this.orders[pendingOrder].totalPrice
            this.total = this.total.toFixed(2)
          }
        })
        .catch(error => {
          this.orders = []
          console.log(error)
        })
    },
    getProducts() {
      Api.get('products')
        .then(response => {
          this.products = response.data.products
        })
        .catch(error => {
          this.products = []
          console.log(error)
        })
    },
    confirmOrder() {
      var orderIndex = this.pendingOrder()
      var order = this.orders[orderIndex]
      // Change order status to 'Confirmed'
      this.updateStatus(order, this.confirmedStatus)
      this.productsList = order.productsList
      // Update NrOrdered
      var productItem = null
      const quantities = {}
      order.productsList.forEach(function (x) { quantities[x] = (quantities[x] || 0) + 1 })
      for (const [key, value] of Object.entries(quantities)) {
        productItem = this.findProduct(key) // key is the product name
        this.updateNrOrdered(productItem, value) // value is the quantity
      }
      location.reload()
    },
    clearOrder() {
      var orderIndex = this.pendingOrder()
      var order = this.orders[orderIndex]
      this.deleteOrder(order._id)
    },
    updateNrOrdered(productItem, quantity) {
      Api.patch(`/products/${productItem._id}`, {
        nrOrdered: productItem.nrOrdered + quantity
      }).then(response => {
        console.log(response.data)
      }).catch(error => {
        console.log(error)
      })
      console.log(this.products)
    },
    updateStatus(order, newStatus) {
      Api.patch(`/orders/${order._id}`, {
        orderStatus: newStatus
      }).then(response => {
        console.log(response.data.message)
      }).catch(error => {
        console.log(error)
      })
    },
    deleteOrder(orderID) {
      Api.delete(`/orders/${orderID}`)
        .then(response => {
          console.log(response.data.message)
          var index = this.orders.findIndex(order => order._id === orderID)
          this.orders.splice(index, 1)
          location.reload()
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  components: {
    OrderItem
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.orders {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 2em;
}
.box {
  margin-top: 2em;
}
</style>
