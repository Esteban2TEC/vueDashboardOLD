// User Login
import Login from 'src/components/Login/Login.vue'
import Register from 'src/components/Registrarse/Register.vue'
import Lock from 'src/components/Lock/Lock.vue'

import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

import PanelGeneral from '../components/Dashboard/Views/Panel/General/PanelGeneral.vue'

import MantenedorClientes from '../components/Dashboard/Views/Mantenedores/Clientes/MantenedorClientes.vue'

// Single File Components Template Demo

// Dashboard pages
import Overview from 'src/components/Dashboard/Views/Dashboard/Overview.vue'
import Stats from 'src/components/Dashboard/Views/Dashboard/Stats.vue'

// Pages
import User from 'src/components/Dashboard/Views/Pages/UserProfile.vue'
import TimeLine from 'src/components/Dashboard/Views/Pages/TimeLinePage.vue'

// Components pages
import Buttons from 'src/components/Dashboard/Views/Components/Buttons.vue'
import GridSystem from 'src/components/Dashboard/Views/Components/GridSystem.vue'
import Panels from 'src/components/Dashboard/Views/Components/Panels.vue'
import SweetAlert from 'src/components/Dashboard/Views/Components/SweetAlert.vue'
import Notifications from 'src/components/Dashboard/Views/Components/Notifications.vue'
import Icons from 'src/components/Dashboard/Views/Components/Icons.vue'
import Typography from 'src/components/Dashboard/Views/Components/Typography.vue'

// Forms pages
import RegularForms from 'src/components/Dashboard/Views/Forms/RegularForms.vue'
import ExtendedForms from 'src/components/Dashboard/Views/Forms/ExtendedForms.vue'
import ValidationForms from 'src/components/Dashboard/Views/Forms/ValidationForms.vue'
import Wizard from 'src/components/Dashboard/Views/Forms/Wizard.vue'

// TableList pages
import RegularTables from 'src/components/Dashboard/Views/Tables/RegularTables.vue'
import ExtendedTables from 'src/components/Dashboard/Views/Tables/ExtendedTables.vue'
import PaginatedTables from 'src/components/Dashboard/Views/Tables/PaginatedTables.vue'
// Maps pages
import GoogleMaps from 'src/components/Dashboard/Views/Maps/GoogleMaps.vue'
import FullScreenMap from 'src/components/Dashboard/Views/Maps/FullScreenMap.vue'
import VectorMaps from 'src/components/Dashboard/Views/Maps/VectorMapsPage.vue'

// Calendar
import Calendar from 'src/components/Dashboard/Views/Calendar/CalendarRoute.vue'
// Charts
import Charts from 'src/components/Dashboard/Views/Charts.vue'

let componentsMenu = {
  path: '/components',
  component: DashboardLayout,
  redirect: '/components/buttons',
  children: [
    {
      path: 'buttons',
      name: 'Botones',
      component: Buttons
    },
    {
      path: 'grid-system',
      name: 'Sistema de Grilla',
      component: GridSystem
    },
    {
      path: 'panels',
      name: 'Paneles',
      component: Panels
    },
    {
      path: 'sweet-alert',
      name: 'Alertas Bellas',
      component: SweetAlert
    },
    {
      path: 'notifications',
      name: 'Notificaciones',
      component: Notifications
    },
    {
      path: 'icons',
      name: 'Iconos',
      component: Icons
    },
    {
      path: 'typography',
      name: 'Tipografía',
      component: Typography
    }

  ]
}

let formsMenu = {
  path: '/forms',
  component: DashboardLayout,
  redirect: '/forms/regular',
  children: [
    {
      path: 'regular',
      name: 'Formulario Regular',
      component: RegularForms
    },
    {
      path: 'extended',
      name: 'Formulario Extendido',
      component: ExtendedForms
    },
    {
      path: 'validation',
      name: 'Formulario Validación',
      component: ValidationForms
    },
    {
      path: 'wizard',
      name: 'Wizard',
      component: Wizard
    }
  ]
}

let tablesMenu = {
  path: '/table-list',
  component: DashboardLayout,
  redirect: '/table-list/regular',
  children: [
    {
      path: 'regular',
      name: 'Tablas Regulares',
      component: RegularTables
    },
    {
      path: 'extended',
      name: 'Tablas Extendidas',
      component: ExtendedTables
    },
    {
      path: 'paginated',
      name: 'Tablas con Paginación',
      component: PaginatedTables
    }]
}

let mapsMenu = {
  path: '/maps',
  component: DashboardLayout,
  redirect: '/maps/google',
  children: [
    {
      path: 'google',
      name: 'Google Maps',
      component: GoogleMaps
    },
    {
      path: 'full-screen',
      name: 'Full Screen Map',
      component: FullScreenMap
    },
    {
      path: 'vector-map',
      name: 'Vector Map',
      component: VectorMaps
    }
  ]
}

let pagesMenu = {
  path: '/pages',
  component: DashboardLayout,
  redirect: '/pages/user',
  children: [
    {
      path: 'user',
      name: 'Página: Usuario',
      component: User
    },
    {
      path: 'timeline',
      name: 'Página: Línea de Tiempo',
      component: TimeLine
    }
  ]
}

let othersMenu = {
  path: '/others',
  component: DashboardLayout,
  redirect: '/others/charts',
  children: [
    {
      path: 'charts',
      name: 'Gráficos',
      component: Charts
    },
    {
      path: 'calendar',
      name: 'Calendario',
      component: Calendar
    }
  ]
}

// ------------------------------------------

let rootPage = {
  path: '/',
  component: DashboardLayout,
  redirect: '/login'
}

let loginPage = {
  path: '/login',
  name: 'Login',
  component: Login
}

let registerPage = {
  path: '/register',
  name: 'RegistrarUsuario',
  component: Register
}

let lockPage = {
  path: '/lock',
  name: 'BloquearCuenta',
  component: Lock
}

let panelPage = {
  path: '/admin/panel',
  component: DashboardLayout,
  redirect: '/admin/panel/general',
  children: [
    {
      path: 'general',
      name: 'Panel General',
      component: PanelGeneral
    }
  ]
}

let mantenedoresPage = {
  path: '/admin/mantenedor',
  component: DashboardLayout,
  redirect: '/admin/mantenedor/clientes',
  children: [
    {
      path: 'clientes',
      name: 'Mantenedor de Clientes',
      component: MantenedorClientes
    },
    {
      path: 'licencias',
      name: 'Mantenedor de Licencias',
      component: NotFound
    }
  ]
}

let ticketsPage = {
  path: '/admin/tickets',
  component: DashboardLayout,
  redirect: '/admin/tickets/consultar',
  children: [
    {
      path: 'consultar',
      name: 'Consulta de Tickets',
      component: NotFound
    }
  ]
}

const routes = [
  rootPage,
  loginPage,
  registerPage,
  lockPage,
  panelPage,
  mantenedoresPage,
  ticketsPage,
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: '(*) Panel General',
        component: Overview
      },
      {
        path: 'stats',
        name: 'Estados',
        component: Stats
      }
    ]
  },
  formsMenu,
  componentsMenu,
  tablesMenu,
  mapsMenu,
  pagesMenu,
  othersMenu,
  {path: '*', component: NotFound}
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
 function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
