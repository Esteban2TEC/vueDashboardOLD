<template>
  <div>

    <nav class="navbar navbar-transparent navbar-absolute">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle"
                  data-toggle="collapse"
                  data-target="#navigation-example-2"
                  @click="toggleNavbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>

          <!-- <h5 class="navbar-brand">{{strings.titulo}}</h5> -->
          <!-- <router-link class="navbar-brand" to="/admin">Sucursal Virtual - 2Tec Chile</router-link> -->
        </div>

        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-right">
            <router-link to="/register" tag="li">
              <a>{{strings.menuRegistrarse}}</a>
            </router-link>
            <!--
            <router-link to="/admin/overview" tag="li">
              <a>Mi Panel</a>
            </router-link>
          -->
          </ul>
        </div>

      </div>
    </nav>

    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page" data-color=""
           data-image="static/img/background/bg-6.jpg">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->

        <div class="content">

          <div class="container">
            <div class="row">
              <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">

                <!-- <form method="#" action="/"> -->
                  <div  class="card" data-background="color" data-color="blue">
                    <div class="card-header">
                      <h3 class="card-title"><center><b>{{strings.tituloLoginCard}}</b></center></h3>
                    </div>
                    <div class="card-content">
                      <div class="control has-icon has-icon-right form-group">
                        <label>{{strings.txNameCorreo}}</label>
                        <input type="email"
                        name="email"
                        v-bind:placeholder="strings.txPhCorreo"
                        v-validate="modelValidations.email"
                        class="form-control"
                        v-model="model.login.usuario">
                        <!-- input-no-border -->

                        <small class="text-danger" v-show="email.invalid">
                          {{ getError('email') }}
                        </small>

                      </div>
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
                    </div>
                    <div class="card-footer text-center">
                      <button type="button" class="btn btn-fill btn-wd" v-on:click="validar()">{{strings.btnLoginText}}</button>
                      <br><br>
                      <hr>
                      <div class="forgot">
                        <router-link to="/register">
                          {{strings.txOlvidoPassword}}
                        </router-link>
                      </div>
                    </div>
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

        <div class="full-page-background" style="background-image: url(static/img/background/bg-6.jpg) "></div>
      </div>
    </div>


    <div class="collapse navbar-collapse off-canvas-sidebar">
      <ul class="nav nav-mobile-menu">
        <router-link to="/register" tag="li">
          <a>{{strings.menuRegistrarse}}</a>
        </router-link>
      </ul>
    </div>

  </div>
</template>

<script src="./Login.js"></script>

<style></style>
