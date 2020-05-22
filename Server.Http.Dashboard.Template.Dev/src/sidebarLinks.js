export default [
  {
    name: 'Paneles',
    icon: 'ti-panel',
    collapsed: false,
    children: [{
      name: 'Panel General',
      path: '/admin/panel'
    }]
  },
  {
    name: 'Mantenedores',
    icon: 'ti-pencil',
    collapsed: true,
    children: [{
      name: 'Clientes',
      path: '/admin/mantenedor/clientes'
    },
    {
      name: 'Licencias',
      path: '/admin/mantenedor/licencias'
    }]
  },
  {
    name: 'Tickets',
    icon: 'ti-ticket',
    collapsed: true,
    children: [{
      name: 'Tickets',
      path: '/admin/tickets'
    }]
  },
  {
    name: '(*) Dashboard',
    icon: 'ti-panel',
    collapsed: true,
    children: [{
      name: 'Vista General',
      path: '/admin/dashboard'
    },
    {
      name: 'Estados',
      path: '/admin/stats'
    }]
  },
  {
    name: '(*) Componentes',
    icon: 'ti-package',
    children: [{
      name: 'Botones',
      path: '/components/buttons'
    },
    {
      name: 'Sistema de Grilla',
      path: '/components/grid-system'
    },
    {
      name: 'Paneles',
      path: '/components/panels'
    },
    {
      name: 'Alertas Bellas',
      path: '/components/sweet-alert'
    },
    {
      name: 'Notificaciones',
      path: '/components/notifications'
    },
    {
      name: 'Iconos',
      path: '/components/icons'
    },
    {
      name: 'Tipografía',
      path: '/components/typography'
    }]
  },
  {
    name: '(*) Formularios',
    icon: 'ti-clipboard',
    children: [{
      name: 'Formulario: Regular',
      path: '/forms/regular'
    },
    {
      name: 'Formulario: Extendido',
      path: '/forms/extended'
    },
    {
      name: 'Formulario: Validación',
      path: '/forms/validation'
    },
    {
      name: 'Wizard',
      path: '/forms/wizard'
    }
    ]
  },
  {
    name: '(*) Listas / Tablas',
    icon: 'ti-view-list-alt',
    collapsed: true,
    children: [{
      name: 'Regulares',
      path: '/table-list/regular'
    },
    {
      name: 'Extendidas',
      path: '/table-list/extended'
    },
    {
      name: 'Con Paginación',
      path: '/table-list/paginated'
    }
    ]
  },
  {
    name: '(*) Mapas',
    icon: 'ti-map',
    children: [{
      name: 'Google Maps',
      path: '/maps/google'
    },
    {
      name: 'Full Screen Maps',
      path: '/maps/full-screen'
    },
    {
      name: 'Vector Maps',
      path: '/maps/vector-map'
    }
    ]
  },
  {
    name: '(*) Páginas',
    icon: 'ti-gift',
    children: [{
      name: 'User Page',
      path: '/pages/user'
    },
    {
      name: 'Timeline Page',
      path: '/pages/timeline'
    },
    {
      name: 'Login Page',
      path: '/login'
    },
    {
      name: 'Register Page',
      path: '/register'
    },
    {
      name: 'Lock Page',
      path: '/lock'
    }
    ]
  },
  {
    name: '(*) Otros',
    icon: 'ti-package',
    children: [{
      name: 'Gráficos',
      path: '/others/charts'
    },
    {
      name: 'Calendario',
      path: '/others/calendar'
    }]
  },
  {
    name: '(*) Not Found',
    icon: 'ti-na',
    path: '/notFoundMenu'
  }
]
