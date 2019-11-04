<template>
  <div id="app">
    <router-view v-if="IsRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      IsRouterAlive:true
    }
  },
  methods:{
    reload(){
      this.IsRouterAlive=false;
      this.$nextTick(function(){
        this.IsRouterAlive=true
      })
    }
  }
}
</script>
