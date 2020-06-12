<template>
    <div class="img">
       
        <router-link to="/back/users"></router-link>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    .img {
        width: 669px;
        height: 364px;
        background: url(./images/404.png) center center no-repeat;
        background-size: 669px 364px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -182px;
        margin-left: -335px;

        a {
            width: 100px;
            height: 50px;
            display: block;
            margin: 220px auto 0;
        }
    }
</style>


