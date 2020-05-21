<template>
  <div class="row">

    <!-- CAMPOS DE CONSULTA -->
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <!-- <h4 class="card-title">Form Elements</h4> -->
          <button name="btnLimpiarFormulario" type="button" class="btn btn-xs btn-info btn-fill btn-rotate pull-right"
                  @click="limpiarFormulario()">
                                          <span class="btn-label">
                                              <i class="ti-brush-alt"></i>
                                          </span>
            {{strings.botones.btnLimpiarFormulario}}
          </button>
          <legend><b>{{strings.titulos.infoCliente}}</b></legend>



        </div>
        <div class="card-content">

          <div class="row">

            <div class="col-md-4">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblNombrePersona}}</label>

                <input type="text"
                name="nombrePersona"
                v-bind:placeholder="strings.campos.txPhNombrePersona"
                class="form-control"
                v-model="model.campos.nombrePersona">
              </div>
            </div>

            <div class="col-md-4">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblRutPersona}}</label>

                <input type="text"
                name="rutPersona"
                v-bind:placeholder="strings.campos.txPhRutPersona"
                class="form-control"
                v-model="model.campos.rutPersona">
              </div>
            </div>

            <div class="col-md-4">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblEmail}}</label>

                <input type="email"
                name="email"
                v-bind:placeholder="strings.campos.txPhEmail"
                v-validate="modelValidations.email"
                class="form-control"
                v-model="model.campos.email">
                <!-- input-no-border -->
                <small class="text-danger" v-show="email.invalid">
                  {{ getError('email') }}
                </small>
              </div>
            </div>

          </div>

          <div class="row">

            <div class="col-md-4">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblPerfilCuenta}}</label>

                <input type="text"
                name="perfilCuenta"
                v-bind:placeholder="strings.campos.txPhPerfilCuenta"
                class="form-control"
                v-model="model.campos.perfilCuenta">
              </div>
            </div>

            <div class="col-md-4">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblEstadoCuenta}}</label>

                <input type="text"
                name="estadoCuenta"
                v-bind:placeholder="strings.campos.txPhEstadoCuenta"
                class="form-control"
                v-model="model.campos.estadoCuenta">
              </div>
            </div>

            <div class="col-md-4">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblTipoCuenta}}</label>

                <input type="text"
                name="tipoCuenta"
                v-bind:placeholder="strings.campos.txPhTipoCuenta"
                class="form-control"
                v-model="model.campos.tipoCuenta">
              </div>
            </div>

          </div>

          <div class="row">

            <div class="col-md-6">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblDireccionParticular}}</label>

                <input type="text"
                name="direccionParticular"
                v-bind:placeholder="strings.campos.txPhDireccionParticular"
                class="form-control"
                v-model="model.campos.direccionParticular">
              </div>
            </div>

            <div class="col-md-3">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblCelularPrimario}}</label>

                <input type="text"
                name="celularPrimario"
                v-bind:placeholder="strings.campos.txPhCelularPrimario"
                class="form-control"
                v-model="model.campos.celularPrimario">
              </div>
            </div>

            <div class="col-md-3">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblFonoPrimario}}</label>

                <input type="text"
                name="fonoPrimario"
                v-bind:placeholder="strings.campos.txPhFonoPrimario"
                class="form-control"
                v-model="model.campos.fonoPrimario">
              </div>
            </div>

          </div>

          <hr>

          <button name="btnLimpiarFormulario" type="button" class="btn btn-xs btn-info btn-fill btn-rotate pull-right"
                  @click="limpiarFormulario()">
                                          <span class="btn-label">
                                              <i class="ti-brush-alt"></i>
                                          </span>
            {{strings.botones.btnLimpiarFormulario}}
          </button>
          <legend><b>{{strings.titulos.infoAdicional}}</b></legend>

          <div class="row">

            <div class="col-md-4">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblNombreContactoEmpresa}}</label>

                <input type="text"
                name="nombreContactoEmpresa"
                v-bind:placeholder="strings.campos.txPhNombreContactoEmpresa"
                class="form-control"
                v-model="model.campos.nombreContactoEmpresa">
              </div>
            </div>

            <div class="col-md-4">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblRutComercial}}</label>

                <input type="text"
                name="rutComercial"
                v-bind:placeholder="strings.campos.txPhRutComercial"
                class="form-control"
                v-model="model.campos.rutComercial">
              </div>
            </div>

            <div class="col-md-4">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblEmailSecundario}}</label>

                <input type="email"
                name="emailSecundario"
                v-bind:placeholder="strings.campos.lblEmailSecundario"
                v-validate="modelValidations.emailSecundario"
                class="form-control"
                v-model="model.campos.emailSecundario">
                <!-- input-no-border -->
                <small class="text-danger" v-show="emailSecundario.invalid">
                  {{ getError('emailSecundario') }}
                </small>
              </div>
            </div>

          </div>

          <div class="row">

            <div class="col-md-6">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblRazonSocial}}</label>

                <input type="text"
                name="rasonSocial"
                v-bind:placeholder="strings.campos.txPhRazonSocial"
                class="form-control"
                v-model="model.campos.rasonSocial">
              </div>
            </div>

            <div class="col-md-6">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblGiroEmpresa}}</label>

                <input type="text"
                name="giroEmpresa"
                v-bind:placeholder="strings.campos.txPhGiroEmpresa"
                class="form-control"
                v-model="model.campos.giroEmpresa">
              </div>
            </div>

          </div>

          <div class="row">

            <div class="col-md-6">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblDireccionComercial}}</label>

                <input type="text"
                name="direccionComercial"
                v-bind:placeholder="strings.campos.txPhDireccionComercial"
                class="form-control"
                v-model="model.campos.direccionComercial">
              </div>
            </div>

            <div class="col-md-3">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblCelularSecundario}}</label>

                <input type="text"
                name="celularSecundario"
                v-bind:placeholder="strings.campos.txPhCelularSecundario"
                class="form-control"
                v-model="model.campos.celularSecundario">
              </div>
            </div>

            <div class="col-md-3">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblFonoSecundario}}</label>

                <input type="text"
                name="fonoSecundario"
                v-bind:placeholder="strings.campos.txPhFonoSecundario"
                class="form-control"
                v-model="model.campos.fonoSecundario">
              </div>
            </div>

          </div>

          <hr>

          <button name="btnLimpiarFormulario" type="button" class="btn btn-xs btn-info btn-fill btn-rotate pull-right"
                  @click="limpiarFormulario()">
                                          <span class="btn-label">
                                              <i class="ti-brush-alt"></i>
                                          </span>
            {{strings.botones.btnLimpiarFormulario}}
          </button>
          <legend><b>{{strings.titulos.infoInicioSesion}}</b></legend>

          <div class="row">

            <div class="col-md-6 col-md-offset-3">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblUsuarioSesion}}</label>

                <input type="email"
                name="usuarioSesion"
                v-bind:placeholder="strings.campos.txPhUsuarioSesion"
                v-validate="modelValidations.usuarioSesion"
                class="form-control"
                v-model="model.campos.usuarioSesion">
                <!-- input-no-border -->
                <small class="text-danger" v-show="usuarioSesion.invalid">
                  {{ getError('usuarioSesion') }}
                </small>
              </div>
            </div>

            <div class="col-md-6 col-md-offset-3">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblPassword}}</label>

                <input type="password"
                name="password"
                v-bind:placeholder="strings.campos.txPhPassword"
                v-validate="modelValidations.password"
                class="form-control"
                v-model="model.campos.password">

                <small class="text-danger" v-show="password.invalid">
                  {{ getError('password') }}
                </small>
              </div>
            </div>

            <div class="col-md-6 col-md-offset-3">
              <div class="control has-icon has-icon-right form-group">
                <label style="white-space:nowrap" class="col-md-3 control-label">{{strings.campos.lblPasswordRepeat}}</label>

                <input type="password"
                name="passwordRepeat"
                v-bind:placeholder="strings.campos.txPhPasswordRepeat"
                v-validate="modelValidations.password"
                class="form-control"
                v-model="model.campos.passwordRepeat">

                <small class="text-danger" v-show="passwordRepeat.invalid">
                  {{ getError('passwordRepeat') }}
                </small>
              </div>
            </div>

          </div>

          <hr>

        </div>

        <div class="card-footer text-center">

          <div class="row">
            <div class="col-md-12">

              <button name="btnIngresar" type="button" class="btn btn-wd btn-info btn-fill btn-rotate"
                      @click="ingresarDatos()">
                                              <span class="btn-label">
                                                  <i class="ti-save"></i>
                                              </span>
                Ingresar
              </button>

              <button name="btnModificar" type="button" class="btn btn-wd btn-info btn-fill btn-rotate"
                      @click="modificarDatos()">
                                              <span class="btn-label">
                                                  <i class="ti-pencil"></i>
                                              </span>
                Modificar
              </button>
              <!--
              <button name="btnEliminar" type="button" class="btn btn-wd btn-info btn-fill btn-rotate"
                      @click="eliminarDatos()">
                                              <span class="btn-label">
                                                  <i class="ti-trash"></i>
                                              </span>
                Eliminar
              </button>
              -->
            </div>
          </div>

        </div>
      </div>  <!-- end card -->
    </div> <!-- end col-md-12 -->
    <!-- FIN: CAMPOS DE CONSULTA -->

    <!-- TABLA CON PAGINACIÓN -->
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <legend><b>{{strings.titulos.listaClientes}}</b></legend>
        </div>

        <div class="card-content">

          <div class="row">

            <div class="col-md-12">

              <el-select
                class="select-default"
                v-model="pagination.perPage"
                placeholder="Per page">
                <el-option
                  class="select-default"
                  v-for="item in pagination.perPageOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>

              <div class="pull-right">
                <label>
                  <input type="search" class="form-control input-sm" placeholder="Buscar en Registros" v-model="searchQuery" aria-controls="datatables">
                </label>
              </div>

            </div>

          </div>

          <div class="row">

            <div class="col-sm-12">
              <el-table class="table-striped"
                        :data="queriedData"
                        border
                        style="width: 100%">

                <el-table-column v-for="column in tableColumns"
                                 :key="column.label"
                                 :min-width="column.minWidth"
                                 :prop="column.prop"
                                 :label="column.label">
                </el-table-column>

                <el-table-column
                  :min-width="100"
                  fixed="right"
                  label="Opciones">
                  <template slot-scope="props">
                    <a class="btn btn-simple btn-xs btn-info btn-icon like" @click="handleView(props.$index, props.row)"><i class="ti-eye"></i></a>
                    <a class="btn btn-simple btn-xs btn-warning btn-icon edit" @click="handleEdit(props.$index, props.row)"><i class="ti-pencil-alt"></i></a>
                    <a class="btn btn-simple btn-xs btn-danger btn-icon remove"  @click="eliminarDatos(props.$index, props.row)"><i class="ti-close"></i></a>
                  </template>
                </el-table-column>

              </el-table>
            </div>
            <div class="col-sm-6 pagination-info">
              <p class="category">Mostrando {{from + 1}} a {{to}} de {{total}} registros en total</p>
            </div>
            <div class="col-sm-6">
              <p-pagination class="pull-right"
                            v-model="pagination.currentPage"
                            :per-page="pagination.perPage"
                            :total="pagination.total">
              </p-pagination>
            </div>

          </div>


        </div>
      </div>
    </div>
    <!-- FIN: TABLA CON PAGINACIÓN -->

  </div>
</template>

<script src="./MantenedorClientes.js"></script>

<style>
</style>
