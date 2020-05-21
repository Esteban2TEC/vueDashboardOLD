process.env.UV_THREADPOOL_SIZE = 240;

const Servidor =  require("./ServerExpress.AdminDashboard");

/* API - Http */
Servidor.start();
