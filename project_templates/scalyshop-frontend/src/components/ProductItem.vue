<template>
  <b-list-group-item>
    <img alt="Product" src="../assets/game.png">
    {{ product.name }} - ( {{ product.price }}kr )
    <b-button type="button" class="close" @click="$emit('order-product', product._id)">
      <img alt="Add To Cart" src="../assets/addtocart.jpg">
    </b-button>
  </b-list-group-item>
</template>

<script>

export default {
  name: 'product-item',
  props: ['product']
}
</script>

<style scoped>
img {
  width: 33px;
  margin-right: 10px;
}
</style>
