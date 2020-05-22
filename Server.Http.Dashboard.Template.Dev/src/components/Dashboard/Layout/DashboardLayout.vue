<template id="dashboardLayout">

    <div class="wrapper">

      <side-bar type="sidebar" :sidebar-links="$sidebar.sidebarLinks">
        <user-menu @bloquear-sesion="bloquearSesion" @cerrar-sesion="cerrarSesion"></user-menu>
        <form class="navbar-form navbar-left navbar-search-form navbar-search-form-mobile" role="search">
          <div class="input-group">
            <span class="input-group-addon"><i class="fa fa-search"></i></span>
            <input type="text" value="" class="form-control" placeholder="Buscar...">
          </div>
        </form>
        <mobile-menu></mobile-menu>
      </side-bar>

      <div class="main-panel">

        <top-navbar></top-navbar>

        <dashboard-content @click.native="toggleSidebar">

        </dashboard-content>

        <content-footer></content-footer>
      </div>
    </div>

</template>

<script src="./DashboardLayout.js"></script>

<style lang="scss">
</style>
