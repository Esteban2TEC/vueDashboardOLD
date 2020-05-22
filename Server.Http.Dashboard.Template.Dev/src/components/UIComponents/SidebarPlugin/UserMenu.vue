<template id="userMenu">
  <div class="user">
    <div class="photo">
      <img src="static/img/faces/face-2.jpg"/>
    </div>
    <div class="info">
      <a data-toggle="collapse" @click="toggleMenu()" href="javascript:void(0)">
           <span>
             {{model.userData.mailUsuario}}
             <b class="caret"></b>
          </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <el-collapse-transition>
          <ul class="nav" v-show="!isClosed">
            <li>
              <a href="javascript:void(0)">
                <span class="sidebar-mini">MP</span>
                <span class="sidebar-normal">Mi Perfil</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <span class="sidebar-mini">C</span>
                <span class="sidebar-normal">Configuración</span>
              </a>
            </li>
            <li>
              <!-- bloquearSesion() -->
              <a @click="$emit('bloquear-sesion')" href="javascript:void(0)">
                <span class="sidebar-mini">B</span>
                <span class="sidebar-normal">Bloquear</span>
              </a>
            </li>
            <li>
              <a @click="$emit('cerrar-sesion')" href="javascript:void(0)">
                <span class="sidebar-mini">CS</span>
                <span class="sidebar-normal">Cerrar Sesión</span>
              </a>
            </li>
          </ul>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script src="./UserMenu.js"></script>

<style>
  .collapsed {
    transition: opacity 1s;
  }
</style>
