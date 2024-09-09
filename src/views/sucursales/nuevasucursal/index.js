import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CFormSelect,
    CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
    cilPlus,
} from '@coreui/icons'
import React, { useEffect, useState } from 'react'
import $, { data } from 'jquery';
import Service from "../../../services/Service"
import FullScreenSpinner from '../../../components/FullScreenSpinner ';
import 'datatables.net';


var URL_GUARDAR_NUEVA = "/sucursales/nueva_sucursal"
var URL_CARGAR_SUCURSALES = "/sucursales/cargar_sucursal"
var URL_CARGAR_SUCURSALES_CAMARAS = "/sucursales/cargar_sucursal_camara"
var URL_ACTUALIZAR_SUCURSAL = "/sucursales/actualizar_sucursal"
var URL_GUARDAR_NUEVA_CAMARA = "/sucursales/nueva_sucursal_camara"
var URL_ACTUALIZAR_SUCURSAL_CAMARA = "/sucursales/actualizar_sucursal_camara"


function Nueva_Sucursal() {
    const [visible, setVisible] = useState(false);
    const [visibleCam, setvisibleCam] = useState(false);

    const [loading, setLoading] = useState(false);
    const [EsActualizar, setEsActualizar] = useState(0);
    const [EsActualizarCam, setEsActualizarCam] = useState(0);


    const [Sucursal, setSucursal] = useState('');
    const [Direccion, setDireccion] = useState('');
    const [Telefono, setTelefono] = useState('');
    const [Correo, setCorreo] = useState('');
    const [Encargado, setEncargado] = useState('');
    const [ID, setID] = useState('');


    const [CAMARAID, setCAMARAID] = useState('');
    const [Camara_nombre, setCamara_nombre] = useState('');
    const [Camara_descripcion, setCamara_descripcion] = useState('');
    const [Camara_ubicacion, setCamara_ubicacion] = useState('');


    const Guardar_Datos = async () => {
        let Sucursal = $("#Sucursal").val();
        let Direccion = $("#Direccion").val();
        let Telefono = $("#Telefono").val();
        let Correo = $("#Correo").val();
        let Encargado = $("#Encargado").val();

        if (Sucursal.trim() == "") {
            Service.Mensaje("Ingrese un nombre para la sucursal", "", "error");
            return;
        }

        if (Telefono.trim() == "") {
            Service.Mensaje("Ingrese un telefono para la sucursal", "", "error");
            return;
        }

        if (Encargado.trim() == "") {
            Service.Mensaje("Seleccione un encargado para la sucursal", "", "error");
            return;
        }

        let param = {
            SUCURSAL_NOMBRE: Sucursal,
            SUCURSAL_DIRECCION: Direccion,
            SUCURSAL_TELEFONO: Telefono,
            SUCURSAL_ENCARGADO: Correo,
            SUCURSAL_ENCARGADO: Encargado,
            CREADO_POR: ""
        }

        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_GUARDAR_NUEVA, param);

        if (datos.data.success) {
            $("#Sucursal").val("");
            $("#Direccion").val("");
            $("#Telefono").val("");
            $("#Correo").val("");
            $("#Encargado").val("");
            Service.Mensaje("Datos Guardados", "", "success");
            Cargar_Datos();
        }
        setLoading(false);

        // Service.AjaxSendReceiveData(URL_GUARDAR_NUEVA, param, function (x) {
        //     

        // })
    }

    const Cargar_Datos = async () => {
        const datos = await Service.AjaxSendReceive(URL_CARGAR_SUCURSALES, []);

        Llenar_Tabla_Sucursales(datos.data.data)
    }

    function Llenar_Tabla_Sucursales(data) {
        $('#TABLA_SUCUSALES_SECC').empty();
        let a = `
        <table id='TABLA_SUCUSALES' class='table table-striped'>
        </table>
        `
        $('#TABLA_SUCUSALES_SECC').append(a);

        let TABLA_ = $('#TABLA_SUCUSALES').DataTable({
            destroy: true,
            data: data,
            dom: 'frtip',
            paging: false,
            info: false,
            // buttons: ['colvis', "excel"],
            // scrollCollapse: true,
            // scrollX: true,
            // columnDefs: [
            //     { width: 100, targets: 0 },
            //     { width: 300, targets: 2 },
            // ],
            order: [[0, "asc"]],
            columns: [
                {
                    "data": "CODIGO",
                    "title": "CODIGO",
                    className: "text-start",
                }, {
                    "data": "SUCURSAL_NOMBRE",
                    "title": "SUCURSAL",
                    className: "text-start",
                }, {
                    "data": "SUCURSAL_ENCARGADO",
                    "title": "ENCARGADO",
                    className: "text-start",
                }, {
                    data: null,
                    title: "",
                    className: "btn_Detalles text-left", // Centrar la columna "Detalles" y aplicar la clase "btn_detalles"
                    defaultContent: '<button type="button" class="btn_Eliminar btn btn-info text-light btn-sm"><i class="bi bi-ui-checks"></i></button>',
                    orderable: "",
                    width: 20
                }, {
                    data: null,
                    title: "",
                    className: "btn_camaras text-left", // Centrar la columna "Detalles" y aplicar la clase "btn_detalles"
                    defaultContent: '<button type="button" class="btn_camaras btn btn-success text-light btn-sm"><i class="bi bi-camera-video-fill"></i></button>',
                    orderable: "",
                    width: 20
                }

            ],
            "createdRow": function (row, data, index) {
                $('td', row).eq(0).addClass("fw-bold fs-6 ");
                $('td', row).eq(1).addClass("fw-bold fs-6 ");
                $('td', row).eq(2).addClass("fw-bold fs-6 ");
                $('td', row).eq(3).addClass("fw-bold fs-6 ");
                $('td', row).eq(0).addClass("bg-warning bg-opacity-10");

            },

        });
        $('#TABLA_SUCUSALES').on('click', 'td.btn_Detalles', function (respuesta) {
            var data = TABLA_.row(this).data();


            setVisible(true);
            setEsActualizar(1);
            setSucursal(data.SUCURSAL_NOMBRE);
            setDireccion(data.SUCURSAL_DIRECCION);
            setTelefono(data.SUCURSAL_TELEFONO);
            setCorreo(data.SUCURSAL_NOMBRE);
            setEncargado(data.SUCURSAL_ENCARGADO);
            setID(data.ID);
            // $("#Sucursal").val(data.SUCURSAL_NOMBRE);
        });

        $('#TABLA_SUCUSALES').on('click', 'td.btn_camaras', function (respuesta) {
            var data = TABLA_.row($(this).closest('tr')).data();
            setID(data.ID);
            setTimeout(() => {
                Cargar_Datos_Camara(data.ID);
            }, 100);
        });
    }

    function LimpiarCampos() {
        setSucursal("");
        setDireccion("");
        setTelefono("");
        setCorreo("");
        setEncargado("");
        setID("");
    }

    const Actualizar_Datos = async () => {
        let Sucursal = $("#Sucursal").val();
        let Direccion = $("#Direccion").val();
        let Telefono = $("#Telefono").val();
        let Correo = $("#Correo").val();
        let Encargado = $("#Encargado").val();

        if (Sucursal.trim() == "") {
            Service.Mensaje("Ingrese un nombre para la sucursal", "", "error");
            return;
        }

        if (Telefono.trim() == "") {
            Service.Mensaje("Ingrese un telefono para la sucursal", "", "error");
            return;
        }

        if (Encargado.trim() == "") {
            Service.Mensaje("Seleccione un encargado para la sucursal", "", "error");
            return;
        }

        let param = {
            SUCURSAL_NOMBRE: Sucursal,
            SUCURSAL_DIRECCION: Direccion,
            SUCURSAL_TELEFONO: Telefono,
            SUCURSAL_ENCARGADO: Correo,
            SUCURSAL_ENCARGADO: Encargado,
            ID: ID,
            CREADO_POR: ""
        }

        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_ACTUALIZAR_SUCURSAL, param);

        if (datos.data.success) {
            Service.Mensaje("Datos Actualizados", "", "success");
            Cargar_Datos();
        }
        setLoading(false);

        // Service.AjaxSendReceiveData(URL_GUARDAR_NUEVA, param, function (x) {
        //     

        // })
    }

    const Cargar_Datos_Camara = async (id) => {
        let param = {
            SUCURSAL_ID: id
        }
        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_CARGAR_SUCURSALES_CAMARAS, param);
        console.log('datos: ', datos);
        Llenar_Tabla_Sucursales_Camaras(datos.data.data)
        setLoading(false);
    }

    function Llenar_Tabla_Sucursales_Camaras(data) {
        console.log('data: ', data);
        $('#TABLA_SUCUSALES_CAMARAS_SECC').empty();
        let a = `
        <table id='TABLA_SUCUSALES_CAMARAS' class='table table-striped'>
        </table>
        `
        $('#TABLA_SUCUSALES_CAMARAS_SECC').append(a);

        let TABLA_ = $('#TABLA_SUCUSALES_CAMARAS').DataTable({
            destroy: true,
            data: data,
            dom: 'frtip',
            paging: false,
            info: false,
            // buttons: ['colvis', "excel"],
            // scrollCollapse: true,
            // scrollX: true,
            // columnDefs: [
            //     { width: 100, targets: 0 },
            //     { width: 300, targets: 2 },
            // ],
            order: [[0, "asc"]],
            columns: [
                {
                    "data": "CODIGO",
                    "title": "CODIGO",
                    className: "text-start",
                }, {
                    "data": "CAMARA_NOMBRE",
                    "title": "NOMBRE",
                    className: "text-start",
                }, {
                    "data": "CAMARA_UBICACION",
                    "title": "UBICACION",
                    className: "text-start",
                }, {
                    data: null,
                    title: "",
                    className: "btn_Detalles text-left", // Centrar la columna "Detalles" y aplicar la clase "btn_detalles"
                    defaultContent: '<button type="button" class="btn_Eliminar btn btn-info text-light btn-sm"><i class="bi bi-ui-checks"></i></button>',
                    orderable: "",
                    width: 20
                }

            ],
            "createdRow": function (row, data, index) {
                $('td', row).eq(0).addClass("fw-bold fs-6 ");
                $('td', row).eq(1).addClass("fw-bold fs-6 ");
                $('td', row).eq(2).addClass("fw-bold fs-6 ");
                $('td', row).eq(3).addClass("fw-bold fs-6 ");
                $('td', row).eq(0).addClass("bg-warning bg-opacity-10");

            },

        });

        $('#TABLA_SUCUSALES_CAMARAS').on('click', 'td.btn_Detalles', function (respuesta) {
            var data = TABLA_.row(this).data();
            console.log('data: ', data);
            setvisibleCam(true);
            setEsActualizarCam(1);
            setCAMARAID(data.ID);
            setCamara_nombre(data.CAMARA_NOMBRE);
            setCamara_descripcion(data.CAMARA_DESCRIPCION);
            setCamara_ubicacion(data.CAMARA_UBICACION);
        });

    }

    const Guardar_Datos_Camara = async () => {
        let Cam_nombre = $("#Cam_nombre").val();
        let Cam_descripcion = $("#Cam_descripcion").val();
        let Cam_ubicacion = $("#Cam_ubicacion").val();


        if (Cam_nombre.trim() == "") {
            Service.Mensaje("Ingrese un nombre para la camara", "", "error");
            return;
        }

        if (Cam_descripcion.trim() == "") {
            Service.Mensaje("Ingrese una descripcion", "", "error");
            return;
        }

        if (Cam_ubicacion.trim() == "") {
            Service.Mensaje("Ingrese la ubicacion", "", "error");
            return;
        }

        let param = {
            SUCURSAL_ID: ID,
            CAMARA_NOMBRE: Cam_nombre,
            CAMARA_DESCRIPCION: Cam_descripcion,
            CAMARA_UBICACION: Cam_ubicacion,
        }

        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_GUARDAR_NUEVA_CAMARA, param);
        if (datos.data.success) {
            Service.Mensaje("Datos Guardados", "", "success");
            Cargar_Datos_Camara(ID);
        } else {
            Service.Mensaje("Error al guardar", datos.message, "success");
        }
        setLoading(false);

        // Service.AjaxSendReceiveData(URL_GUARDAR_NUEVA, param, function (x) {
        //     

        // })
    }

    const Actualizar_Datos_Camara = async () => {
        let Cam_nombre = $("#Cam_nombre").val();
        let Cam_descripcion = $("#Cam_descripcion").val();
        let Cam_ubicacion = $("#Cam_ubicacion").val();


        if (Cam_nombre.trim() == "") {
            Service.Mensaje("Ingrese un nombre para la camara", "", "error");
            return;
        }

        if (Cam_descripcion.trim() == "") {
            Service.Mensaje("Ingrese una descripcion", "", "error");
            return;
        }

        if (Cam_ubicacion.trim() == "") {
            Service.Mensaje("Ingrese la ubicacion", "", "error");
            return;
        }

        let param = {
            SUCURSAL_ID: ID,
            CAMARA_ID: CAMARAID,
            CAMARA_NOMBRE: Cam_nombre,
            CAMARA_DESCRIPCION: Cam_descripcion,
            CAMARA_UBICACION: Cam_ubicacion,
        }
        console.log('param: ', param);

        setLoading(true);
        const datos = await Service.AjaxSendReceive(URL_ACTUALIZAR_SUCURSAL_CAMARA, param);
        console.log('datos: ', datos);
        if (datos.data.success) {
            Service.Mensaje("Datos Guardados", "", "success");
            Cargar_Datos_Camara(ID);
        } else {
            Service.Mensaje("Error al guardar", datos.message, "success");
        }
        setLoading(false);

        // Service.AjaxSendReceiveData(URL_GUARDAR_NUEVA, param, function (x) {
        //     

        // })
    }

    function Limpiar_Campos_Camara() {
        setCAMARAID("");
        setCamara_nombre("");
        setCamara_descripcion("");
        setCamara_ubicacion("");
    }


    useEffect(() => {
        Cargar_Datos(); // Llamamos a la función cuando el componente se monta
        Llenar_Tabla_Sucursales_Camaras([])
    }, []);

    return (
        <>
            <FullScreenSpinner loading={loading} /> {/* Mostrar el spinner cuando loading es true */}
            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Sucursales
                            </h4>
                        </CCol>
                        <CCol sm={7} className="d-none d-md-block">
                            <CButton onClick={() => {
                                setVisible(!visible);
                                setEsActualizar(0);
                                LimpiarCampos();
                            }} color="success" className="float-end fw-bold text-light">
                                Nueva Sucursal <CIcon icon={cilPlus} />
                            </CButton>
                        </CCol>
                    </CRow>
                    <hr />
                    <CRow>
                        <CCol sm={6} className='pt-5'>
                            <div className='table-responsive'>
                                <div id='TABLA_SUCUSALES_SECC'>
                                    <table id='TABLA_SUCUSALES' className='table table-striped'>
                                        {/* Aquí va el contenido de la tabla */}
                                    </table>
                                </div>
                            </div>
                        </CCol>
                        <CCol sm={6} className='pt-5'>
                            <CButton onClick={() => {
                                setvisibleCam(true);
                                setEsActualizarCam(0);
                                Limpiar_Campos_Camara();
                            }} color="warning" className='fw-bold text-light btn-sm'>
                                Agregar Camara <i className="bi bi-camera-video fs-6"></i>
                            </CButton>

                            <div className='table-responsive'>
                                <div id='TABLA_SUCUSALES_CAMARAS_SECC'>
                                    <table id='TABLA_SUCUSALES_CAMARAS' className='table table-striped'>
                                    </table>
                                </div>
                            </div>
                        </CCol>
                    </CRow>
                </CCardBody>

                <CModal size="lg" backdrop="static" visible={visible} onClose={() => setVisible(false)}>
                    <CModalHeader>
                        <CModalTitle></CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <div className='col-12'>
                            <div className="mb-3">
                                <CFormLabel htmlFor="Sucursal">Sucursal Nombre</CFormLabel>
                                <CFormInput defaultValue={Sucursal} type="text" id="Sucursal" placeholder="" />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="Direccion">Direccion</CFormLabel>
                                <CFormInput defaultValue={Direccion} type="text" id="Direccion" placeholder="" />
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <CFormLabel htmlFor="Telefono">Telefono</CFormLabel>
                                    <CFormInput defaultValue={Telefono} type="text" id="Telefono" placeholder="" />
                                </div>
                                <div className="col-6 mb-3">
                                    <CFormLabel htmlFor="Correo">Correo</CFormLabel>
                                    <CFormInput defaultValue={Correo} type="text" id="Correo" placeholder="" />
                                </div>
                            </div>
                            <div className="col-6 mb-3">
                                <CFormLabel htmlFor="Encargado">Encargado</CFormLabel>
                                <CFormSelect id='Encargado' defaultValue={Encargado}>
                                    <option value="">Seleccione un encargado</option>
                                    <option value="1">Encargado 1</option>
                                    <option value="2">Encargado 2</option>
                                    <option value="3">Encargado 3</option>
                                </CFormSelect>
                            </div>
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Cerrar
                        </CButton>
                        {EsActualizar == 0 ? (
                            <CButton onClick={Guardar_Datos} color="primary" className='fw-bold text-light'>
                                Guardar Datos
                            </CButton>
                        ) : (
                            <CButton onClick={Actualizar_Datos} color="warning" className='fw-bold text-light'>
                                Actualizar cambios
                            </CButton>
                        )}

                    </CModalFooter>
                </CModal>

                <CModal size="lg" backdrop="static" visible={visibleCam} onClose={() => setvisibleCam(false)}>
                    <CModalHeader>
                        <CModalTitle></CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <div className='col-12'>
                            <div className="mb-3">
                                <CFormLabel htmlFor="Nombre">Nombre</CFormLabel>
                                <CFormInput defaultValue={Camara_nombre} type="text" id="Cam_nombre" placeholder="" />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="Descripcion">Descripcion</CFormLabel>
                                <CFormInput defaultValue={Camara_descripcion} type="text" id="Cam_descripcion" placeholder="" />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="Ubicacion">Ubicacion</CFormLabel>
                                <CFormInput defaultValue={Camara_ubicacion} type="text" id="Cam_ubicacion" placeholder="" />
                            </div>

                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setvisibleCam(false)}>
                            Cerrar
                        </CButton>
                        {EsActualizarCam == 0 ? (
                            <CButton onClick={Guardar_Datos_Camara} color="primary" className='fw-bold text-light'>
                                Guardar Datos
                            </CButton>
                        ) : (
                            <CButton onClick={Actualizar_Datos_Camara} color="warning" className='fw-bold text-light'>
                                Actualizar cambios
                            </CButton>
                        )}

                    </CModalFooter>
                </CModal>


            </CCard >
        </>
    )
}

export default Nueva_Sucursal
