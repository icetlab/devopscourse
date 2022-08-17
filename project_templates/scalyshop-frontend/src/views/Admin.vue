<template>
  <div class="products">
    <h1>Products</h1>

    <!-- use 'add_view' toggle to decide whether to render the form to add a product or show
         the table of existing products -->
    <b-alert v-model="showAlert" variant="danger" dismissible>
      Creation of a product with an existing name is not allowed!
    </b-alert>
    <!-- Product details form appears when a product is double-clicked -->
    <b-form v-if="this.addView">
        <b-form-group
          id="input-group"
          label="Enter Product Details:"
          description="Here you can manage products."
        >
          <b-form-input
            class="input"
            id="productname"
            v-model="newproduct.name"
            placeholder="Product Name"
            required
          />
          <b-form-input
            class="input"
            id="productcategory"
            v-model="newproduct.category"
            placeholder="Product Category"
            required
          />
          <b-form-input
            class="input"
            id="productprice"
            v-model="newproduct.price"
            placeholder="Product Price"
            required
          />
          <b-button type="button" class="button" @click="addProduct()">Add Product</b-button>
          <b-button type="button" class="button" @click="deleteProduct()">Delete Product</b-button>
        </b-form-group>
    </b-form>

    <!-- other side of the if-else statement -
         BootstrapVue auto-rendered table - see documentation https://bootstrap-vue.org/docs/components/table -->
    <div v-else>
      <b-table striped class= "prods" hover :items="products" :fields="table_fields" :per-page="pagination.per_page" :current-page="pagination.current_page" @row-dblclicked="updateSingle"></b-table>
      <b-pagination class="d-flex justify-content-center" v-if="showPaginationControl"
        v-model="pagination.current_page"
        :total-rows="this.products.length"
        :per-page="pagination.per_page"
      ></b-pagination>
    </div>

    <b-container>

      <b-row>
        <b-col cols="12" class="box">

          <b-toast id="monitoring-toast" title="Notification" static no-auto-hide>
            {{ monitoring_message }}
          </b-toast>

          <b-form-group
                id="button-group"
                label="Data Helpers:"
                description="Some useful buttons to make your life easier.">
            <b-button class="button" type="button" @click="toggleAddShow()">{{ toggleLabel }}</b-button>
            <b-button class="button" type="button" @click="clearDB()">Clear Database</b-button>
            <b-button class="button" type="button" @click="addTestData()" :disabled="testDataButtonDisabled">Batch-Add Test Data</b-button>
          </b-form-group>

          <b-form-group
                id="button-group"
                label="Monitoring Helpers:"
                description="Some more buttons useful for testing your monitoring solution.">

            <b-container fluid>
              <b-row>
                <b-col cols="6">
                  <b-button class="button" type="button" @click="generateFault(404)">Trigger 404 Fault</b-button>
                  <b-button class="button" type="button" @click="generateFault(500)">Trigger 500 Fault</b-button>
                </b-col>
                <b-col cols="6">
                  <b-button class="button" type="button" @click="generateLoad()">Trigger Long-Running Request</b-button>
                  <b-button class="button" type="button" @click="removeStressTestData()">Remove Stress Test Data</b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="6" />
                <b-col cols="6">
                  <b-form-input id="range-1" v-model="loadparam" type="range" min="500" max="5000"></b-form-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="6" />
                <b-col cols="6">
                  <p> Stress Parameter: {{loadparam}} </p>
                </b-col>
              </b-row>
            </b-container>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'Admin',
  data() {
    return {
      products: [],
      table_fields: [
        { key: 'name', sortable: true },
        { key: 'category', sortable: true },
        { key: 'price', sortable: true },
        { key: 'nrReserved', sortable: true },
        { key: 'nrOrdered', sortable: true }
      ],
      pagination: {
        per_page: 10,
        current_page: 1
      },
      newproduct: {
        name: '',
        category: '',
        price: 0.0
      },
      addView: false,
      showAlert: false,
      loadparam: 100,
      monitoring_message: ''
    }
  },
  computed: {
    toggleLabel: function () {
      if (this.addView) {
        return 'Show Products'
      } else {
        return 'Manage Products'
      }
    },
    testDataButtonDisabled: function () {
      return this.products.length !== 0
    },
    showPaginationControl: function () {
      return this.products.length > this.pagination.per_page
    }
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    updateSingle(record, index) {
      this.addView = !this.addView
      this.newproduct.name = record.name
      this.newproduct.category = record.category
      this.newproduct.price = record.price
    },
    toggleAddShow() {
      this.addView = !this.addView
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
    findProduct(productName) {
      return this.products.findIndex(product => product.name === productName)
    },
    addProduct() {
      // check if product name already exists
      var sameNameProduct = this.findProduct(this.newproduct.name)
      if (sameNameProduct !== -1) {
        this.showAlert = true
      } else {
        Api.post('products', {
          name: this.newproduct.name,
          category: this.newproduct.category,
          price: this.newproduct.price,
          nrReserved: 0,
          nrOrdered: 0
        }).then(response => {
          this.products.push(response.data)
          location.reload() // reload the page and show all products
        }).catch(error => {
          console.log(error)
        })
      }
    },
    deleteProduct() {
      var index = this.products.findIndex(product => product.name === this.newproduct.name)
      var prodId = this.products[index]._id
      Api.delete(`/products/${prodId}`)
        .then(response => {
          console.log(response.data.message)
          var index = this.products.findIndex(product => product._id === prodId)
          this.products.splice(index, 1)
          location.reload()
        })
        .catch(error => {
          console.log(error)
        })
    },
    clearDB() {
      Api.delete('products')
        .then(response => {
          this.products = []
        })
        .catch(error => {
          console.log(error)
        })
      this.monitoring_message = 'Database cleared'
      this.$bvToast.show('monitoring-toast')
    },
    addTestData() {
      Api.post('products/testdata')
        .then(response => {
          this.products = response.data.products
        })
        .catch(error => {
          console.log(error)
        })
      this.monitoring_message = 'Batch-added test data'
      this.$bvToast.show('monitoring-toast')
    },
    generateLoad() {
      Api.post('products/stress?loadparam=' + this.loadparam)
        .then(response => {
          console.log('Successfully invoked stress testing endpoint.')
        })
        .catch(error => {
          console.log(error)
        })
      this.monitoring_message = 'Added ' + this.loadparam + ' test elements'
      this.$bvToast.show('monitoring-toast')
    },
    removeStressTestData() {
      Api.post('products/unstress')
        .then(response => {
          console.log('Successfully invoked endpoint that deletes stress test data.')
        })
        .catch(error => {
          console.log(error)
        })
      this.monitoring_message = 'Removed all test elements'
      this.$bvToast.show('monitoring-toast')
    },
    generateFault(statuscode) {
      Api.post('error?statuscode=' + statuscode)
        .then(response => {
          console.log('Something is wrong - expected an error')
        })
        .catch(error => {
          console.log('Received expected error: ' + error)
        })
      this.monitoring_message = 'Generated ' + statuscode + ' request'
      this.$bvToast.show('monitoring-toast')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.button {
  margin-bottom: 1em;
  margin-left: 1em;
  margin-right: 1em;
}
.input {
  margin-bottom: 1em;
  margin-left: 1em;
  margin-right: 1em;
}
.box {
  margin-top: 5em;
  border-style: dotted;
  border-color: grey;
  border-width: 1px;
}
.products {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 2em;
}
.prods {
    cursor: pointer;
}
.warningbutton {
  color: #FF7F7F;
}
</style>
