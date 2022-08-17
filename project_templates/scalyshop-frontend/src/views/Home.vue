<template>
  <div>
    <b-jumbotron header="Scaly Shop" lead="This is Scaly Shop, your example application for DAT490.">
      <p>Scaly Shop is a three-tier Web application built using <a href="https://vuejs.org">Vue.js</a> in combination with <a href="https://bootstrap-vue.org">BootstrapVue</a> on the frontend and <a href="https://expressjs.com">Express</a> on the backend. Backend data is persistently stored in a <a href="https://www.mongodb.com">MongoDB</a> non-relational database, which is accessed through <a href="https://mongoosejs.com">Mongoose</a>, a simple tool to store Javascript objects in MongoDB.</p>
      <p>In short, Scaly Shop is an exceedingly simple application which is nonetheless built in the same way and using the same architecture and (types of) tools that power many, if not most, production systems you use daily on the Internet.</p>
      <p />
      <p>Acknowledgements: Scaly Shop has been built by Ranim Khojah and Philipp Leitner, as a small extension of a course template originally written by Joel Scheuner for <a href="https://www.gu.se/en/study-gothenburg/web-and-mobile-development-dit341">DIT341</a>. </p>
    </b-jumbotron>

    <b-container>
      <b-row>
        <b-col><h1>Get Started Scaling:</h1></b-col>
      </b-row>
      <b-row>
        <b-col class="example-col" cols="6"> <b-button @click="getMessage()">Check Server Status</b-button></b-col>
        <b-col class="example-col" cols="6">{{ message }}</b-col>
      </b-row>
      <b-row>
        <b-col class="example-col" cols="6"> <b-button href="/customer">Go to Customer View</b-button></b-col>
        <b-col class="example-col" cols="6"> <b-button href="/admin">Go to Admin View</b-button></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    this.getMessage()
  },
  methods: {
    getMessage() {
      Api.get('/serverstatus')
        .then(response => {
          this.message = response.data.message
        })
        .catch(error => {
          this.message = error
        })
    }
  }
}
</script>

<style>
.example-col {
  padding-top: .75rem;
  padding-bottom: .75rem;
  background-color: whitesmoke;
  border: 2px solid lightgray;
}
</style>
