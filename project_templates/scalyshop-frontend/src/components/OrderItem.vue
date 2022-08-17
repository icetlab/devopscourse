<template>
  <b-list-group-item class="outer-card">
    <h4> {{ order.orderRef }} </h4>
    <b-list-group-item v-for="prod in order.productsList" :key="prod" class="inner-card">
      <img alt="Order" src="../assets/game.png">
      {{ prod }}
    </b-list-group-item>
  </b-list-group-item>
</template>

<script>
export default {
  name: 'order-item',
  props: ['order', 'prod']
}
</script>

<style scoped>
img {
  width: 33px;
  margin-right: 10px;
}
.outer-card h4 {
  margin-bottom: 1em;
  margin-top: 0.5em;
}
.inner-card {
  font-weight: normal;
  font-size: medium;
}
</style>
