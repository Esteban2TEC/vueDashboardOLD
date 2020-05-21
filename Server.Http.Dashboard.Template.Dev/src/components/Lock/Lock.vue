<template>
  <div>
    <!--
    <nav class="navbar navbar-transparent navbar-absolute">
      <div class="container">
        <span class="navbar-brand"><center>{{strings.titulo}}</center></span>

        <div class="navbar-header">
          <button type="button"
                  class="navbar-toggle"
                  @click="toggleNavbar"
                  data-toggle="collapse"
                  data-target="#navigation-example-2">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <span class="navbar-brand">{{strings.titulo}}</span>
        </div>

        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-right">

          </ul>
        </div>

      </div>
    </nav>
-->

    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page" data-color=""
            data-image="static/img/background/bg-7.jpg">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">

              <!-- <form method="#" action="#"> -->
                <div class="card card-lock">
                  <div class="author">
                    <img class="avatar" src="static/img/faces/face-2.jpg" alt="...">
                  </div>
                  <h6 class="card-title"><center><b>{{strings.tituloLockCard}}</b></center></h6>
                  <h5>{{model.login.usuario}}</h5>

                  <div class="form-group">
                    <label>{{strings.txNamePassword}}</label>
                    <input type="password"
                    name="password"
                    v-bind:placeholder="strings.txPhPassword"
                    v-validate="modelValidations.password"
                    class="form-control"
                    v-model="model.login.pwd">

                    <small class="text-danger" v-show="password.invalid">
                      {{ getError('password') }}
                    </small>

                  </div>

                  <hr>
                  <button type="button" class="btn btn-fill btn-wd" v-on:click="validar()">{{strings.btnLoginText}}</button>
                  <br><br>
                  <button type="button" class="btn btn-wd" v-on:click="cerrarSesion()">{{strings.btnLogOutText}}</button>
                </div>
              <!-- </form> -->

              </div>
            </div>
          </div>
        </div>

        <footer class="footer footer-transparent">
          <div class="container">
            <div class="copyright">
              &copy; 2017 - <a href="http://www.2tec.cl" target="_blank">2Tec Chile</a> - Todos los Derechos Reservados
              <!-- <i class="fa fa-heart heart"></i> -->
            </div>
          </div>
        </footer>

        <div class="full-page-background" style="background-image: url(static/img/background/bg-7.jpg) "></div>
      </div>
    </div>
    <!--
    <div class="collapse navbar-collapse off-canvas-sidebar">
      <ul class="nav nav-mobile-menu">
        <li>
          <router-link to="/admin">
            Dashboard
          </router-link>
        </li>
      </ul>
    </div>
  -->

  </div>
</template>

<script src="./Lock.js"></script>

<style>
</style>
