<template>
  <div class="orders">
    <h1>History</h1>
    <b-table striped hover :items="orders" :fields="table_fields"></b-table>
    <b-form-group
      id="button-group">
      <b-button class="button" variant="outline-danger" type="button" @click="clearDB()">Clear History</b-button>
    </b-form-group>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      table_fields: [
        { key: 'orderRef', sortable: true },
        { key: 'totalPrice', sortable: true },
        { key: 'productsList', sortable: true },
        { key: 'orderStatus', sortable: true }
      ]
    }
  },
  mounted() {
    this.getOrders()
  },
  methods: {
    getOrders() {
      Api.get('orders')
        .then(response => {
          this.orders = response.data.orders
        })
        .catch(error => {
          this.orders = []
          console.log(error)
        })
    },
    clearDB() {
      Api.delete('orders')
        .then(response => {
          this.orders = []
        })
        .catch(error => {
          console.log(error)
        })
    }
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
</style>
