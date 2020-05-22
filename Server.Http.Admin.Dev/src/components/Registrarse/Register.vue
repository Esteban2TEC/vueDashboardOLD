<template>
  <div>
    <nav class="navbar navbar-transparent navbar-absolute">
      <div class="container">
        <div class="navbar-header">
          <button type="button"
                  class="navbar-toggle navbar-toggle-black"
                  @click="toggleNavbar"
                  data-toggle="collapse"
                  data-target="#navigation-example-2">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar "></span>
            <span class="icon-bar "></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-right">
            <li>
              <router-link to="/login" class="btn">
                {{strings.menuLogin}}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="wrapper wrapper-full-page">
      <div class="register-page">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-8 col-md-offset-2">
                <div class="header-text">
                  <h2>{{strings.tituloGeneral}}</h2>
                  <h3>{{strings.tituloSecundario}}</h3>
                  <h5>{{strings.subTitulo}}</h5>
                  <hr>
                </div>
              </div>
              <div class="col-md-4 col-md-offset-2">
                <div class="media">
                  <div class="media-left">
                    <div class="icon icon-danger">
                      <i class="ti ti-user"></i>
                    </div>
                  </div>
                  <div class="media-body">
                    <h5>Cuenta Gratis</h5>
                    Cuenta de usuario totalmente gratuita, te permitirá acceder a toda la información en tiempo real de los usuarios existentes, además de poder gestionar sus licencias de software, ciclos de facturación y otras funcionalidades.
                  </div>
                </div>
                <div class="media">
                  <div class="media-left">
                    <div class="icon icon-warning">
                      <i class="ti-bar-chart-alt"></i>
                    </div>
                  </div>
                  <div class="media-body">
                    <h5>Tablero Asombroso</h5>
                    Un renovado y espectacular diseño de tablero inteligente, dedicado exclusívamente para un usuario moderno.
                  </div>
                </div>
                <div class="media">
                  <div class="media-left">
                    <div class="icon icon-info">
                      <i class="ti-headphone"></i>
                    </div>
                  </div>
                  <div class="media-body">
                    <h5>Soporte Global</h5>
                    Contamos con soporte online remoto 24/7.
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <form method="#" action="#">
                  <div class="card card-plain">
                    <div class="content">
                      <div class="form-group">
                        <input type="text" v-bind:placeholder="strings.txPhNameNombre" class="form-control">
                      </div>
                      <div class="form-group">
                        <input type="text" v-bind:placeholder="strings.txPhNameApellido" class="form-control">
                      </div>
                      <div class="form-group">
                        <input type="text" v-bind:placeholder="strings.txPhNameEmpresa" class="form-control">
                      </div>
                      <div class="form-group">
                        <input type="email" v-bind:placeholder="strings.txPhNameCorreo" class="form-control">
                      </div>
                      <div class="form-group">
                        <input type="password" v-bind:placeholder="strings.txPhNamePassword" class="form-control">
                      </div>
                      <div class="form-group">
                        <input type="password" v-bind:placeholder="strings.txPhNameRepeatPassword" class="form-control">
                      </div>
                    </div>
                    <div class="footer text-center">
                      <button type="button" class="btn btn-fill btn-danger btn-wd">{{strings.btnCreateText}}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <footer class="footer footer-transparent">
          <div class="container">
            <footer class="footer footer-transparent">
              <div class="container">
                <div class="copyright">
                  &copy; 2017 - <a href="http://www.2tec.cl" target="_blank">2Tec Chile</a> - Todos los Derechos Reservados
                  <!-- <i class="fa fa-heart heart"></i> -->
                </div>
              </div>
            </footer>
          </div>
        </footer>
      </div>
    </div>
    <div class="collapse navbar-collapse off-canvas-sidebar">
      <ul class="nav nav-mobile-menu">
        <li>
          <router-link to="/login">
            {{strings.menuLogin}}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./Register.js"></script>

<style>
</style>
