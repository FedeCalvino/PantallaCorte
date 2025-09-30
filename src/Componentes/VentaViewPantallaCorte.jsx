import React from "react";
import "../Routes/Css/ventaView.css";
import { useState, useEffect, useRef } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";

import { OrdenProduccion } from "./OrdenProduccion";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import {
  selectArticulos,
  selectVenta,
  setArticulos,
  setVenta,
} from "../Features/VentaViewReucer";
import { EditarCortina } from "./EditarCortina";
import {
  selectRollerConfig,
  selectConfigRiel,
  selectConfigTradicional,
} from "../Features/ConfigReducer";
import {
  selectTelasRoller,
  selectTelasTradicional,
} from "../Features/TelasReducer";
import { useDispatch } from "react-redux";
import { Loading } from "./Loading";
import { TicketCortina } from "./TicketCortina";
import { OrdenInstalacion } from "./OrdenInstalacion";
import html2pdf from "html2pdf.js";

export const VentaViewPantallaCorte = ({
  callBackToast,
  ConfirmPaso,
  setConfirmPaso,
  setUndoPaso,
  Ordenes,
}) => {
  const dispatch = useDispatch();

  const ConfigRoller = useSelector(selectRollerConfig);

  //opciones de roller
  const CanosRoller = ConfigRoller?.canos;
  const LadosCadenas = ConfigRoller?.ladosCadena;
  console.log("LadosCadenas", LadosCadenas);
  const Motores = ConfigRoller?.motores;
  const Posiciones = ConfigRoller?.posiciones;
  const TiposCadenas = ConfigRoller?.tiposCadena;

  const [contenido, setcontenido] = useState("");
  const editorRef = useRef(null);

  const ConfigTadicional = useSelector(selectConfigTradicional);
  console.log("ConfigTadicional", ConfigTadicional);
  //opciones de roller
  const Pinzas = ConfigTadicional?.pinzas;
  const Ganchos = ConfigTadicional?.ganchos;
  const Dobladillos = ConfigTadicional?.dobladillos;
  const findNameTipoPinza = (id_tipo) => {
    return Pinzas?.find((tipo) => tipo.idPinza === parseInt(id_tipo))?.nombre;
  };

  const findNameTipoGancho = (id_tipo) => {
    return Ganchos?.find((tipo) => tipo.idGanchos === parseInt(id_tipo))
      ?.nombre;
  };

  const findNameTipoDobladillo = (id_tipo) => {
    return Dobladillos?.find((tipo) => tipo.idDobladillo === parseInt(id_tipo))
      ?.valor;
  };
  const TiposTelas = useSelector(selectTelasRoller);
  const TiposTelasTradi = useSelector(selectTelasTradicional);
  const tableRef = useRef(null);

  const [showModEditVenal, setEditVen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingSetPaso, setloadingSetPaso] = useState(false);
  const [showModalRiel, setshowModalRiel] = useState(false);
  const [agregarArt, setagregarArt] = useState(false);
  const Articulos = useSelector(selectArticulos);
  const Rollers = Articulos?.filter((art) => art?.nombre === "Roller");
  const Romanas = Articulos?.filter((art) => art?.nombre === "Romana");
  console.log("Rollers", Rollers);

  const Rieles = Articulos?.filter((art) => art?.tipoArticulo === "riel");
  const Tradicionales = Articulos?.filter(
    (art) => art?.tipoArticulo === "tradicional"
  );
  const ConfigRiel = useSelector(selectConfigRiel);

  const ladosAcumula = ConfigRiel?.ladoAcumula || [];
  const tipos = ConfigRiel?.tipos || [];

  const findNameladoAcumula = (idLado) => {
    return ladosAcumula?.find((acc) => acc.ladoAcumulaId === parseInt(idLado))
      ?.nombre;
  };
  const findNameTipoRiel = (id_tipo) => {
    return tipos?.find((tipo) => tipo.tipoId === parseInt(id_tipo))?.tipo;
  };

  const [openEdit, setopenEdit] = useState(false);
  const [IdCorEdit, setIdCorEdit] = useState(null);
  const [CortinaEdited, setCortrtinaEdited] = useState([]);
  const [RielEdited, setRielEdited] = useState([]);
  const [TradiEdited, setTradiEdited] = useState([]);

  const [loadingAct, setloadingAct] = useState(false);

  const [CortrtinaTrtyEdited, setCortrtinaTrtyEdited] = useState(null);
  const [RielTryEdited, setRielTryEdited] = useState(null);
  const [TradicionalTryEdited, setTradicionalTryEdited] = useState(null);

  const [Telas, setTelas] = useState([]);

  const Ven = useSelector(selectVenta);
  console.log("Ven", Ven);
  //Edit Venta
  const [ObraEdit, setObraEdit] = useState(Ven.obra?.nombre);
  const [FechaInstEdit, setFechaInstEdit] = useState(Ven.fechaInstalacion);
  const [DireccionEdit, setDireccionEdit] = useState(Ven.obra?.direccion);
  const [CPEdit, setCPEdit] = useState(Ven.obra?.cp);
  const [TelefonoEdit, setTelefonoEdit] = useState(Ven.obra?.telefono);
  const [EmailEdit, setEmailEdit] = useState(Ven.obra?.email);
  const [ContactoEdit, setContactoEdit] = useState(Ven.obra?.contacto);
  const [ShowModalConfirmPaso, setShowModalConfirmPaso] = useState(false);
  const VentasEp = "/VentasEP/";
  //const VentasEp = "http://localhost:8083/Ventas/";

  const VentasEpUpdate = VentasEp + "UpdateFO/";
  //const VentasEpUpdate = "http://localhost:8086/Ventas/UpdateFO/";
  const handleShow = (Art) => {
    if (Art.nombre === "Roller") {
      setTradicionalTryEdited(null);
      setRielTryEdited(null);
      setCortrtinaTrtyEdited(Art);
      console.log("Art", Art);
    }
    if (Art.nombre === "Riel") {
      setCortrtinaTrtyEdited(null);
      setTradicionalTryEdited(null);
      setRielTryEdited(Art);
    }
    if (Art.nombre === "Tradicional") {
      setCortrtinaTrtyEdited(null);
      setRielTryEdited(null);
      setTradicionalTryEdited(Art);
      setcontenido(Art.contenidoProduccion);
    }
    console.log(findOrden(Art.IdArticulo));
    setShowModal(true);
  };

  const ShowModalCallB = () => {
    setopenEdit(false);
    setCortrtinaEdited(null);
    setRielEdited(null);
    setShowModal(false);
  };
  const CortinaEditedFnct = () => {
    setCortrtinaEdited(null);
    setRielEdited(null);
    setCortrtinaTrtyEdited(null);
    setRielTryEdited(null);
    setShowModal(false);
    setopenEdit(false);
    FetchVentaCortinas();
  };

  const handleClose = () => setShowModal(false);
  const handleCloseRiel = () => setshowModalRiel(false);

  /*tabla tradicional*/

  function getAncho(tradi) {
    return tradi.cantidadPanos === 1 ? tradi.ancho : "N/A";
  }

  function getAnchoIzquierdo(tradi) {
    return tradi.cantidadPanos !== 1 ? tradi.ancho : "N/A";
  }

  function getAnchoDerecho(tradi) {
    return tradi.cantidadPanos !== 1 ? tradi.AnchoDerecho : "N/A";
  }

  function getAlto(tradi) {
    return tradi.CantidadAltos === 1 ? tradi.alto : "N/A";
  }

  function getAltoIzquierdo(tradi) {
    return tradi.CantidadAltos !== 1 ? tradi.alto : "N/A";
  }

  function getAltoDerecho(tradi) {
    return tradi.CantidadAltos !== 1 ? tradi.AltoDerecho : "N/A";
  }

  const SetInstalada = async () => {
    setloadingTable(true);
    try {
      const res = await fetch(UrlInstalada + Ven.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok " + res.statusText);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloadingTable(false);
      setopen(false);
      FetchVentas();
    }
  };

  const FetchVentaCortinas = async () => {
    console.log("ventas");
    if (Ven.id != null) {
      try {
        const res = await fetch(VentasEp + Ven.id);
        const data = await res.json();

        console.log("articulos", data.body.listaArticulos);

        console.log(data.body);
        console.log();
        dispatch(setArticulos(data.body.listaArticulos));
        dispatch(setVenta(data.body));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const findNameCano = (idCano) => {
    return CanosRoller?.find((cano) => cano.id === idCano)?.tipo;
  };
  const findNameLadoCadena = (idlado) => {
    return LadosCadenas?.find((lado) => lado.ladoId === idlado)?.lado;
  };
  const findNameMotor = (idMotor) => {
    return Motores?.find((motor) => motor.idMotor === idMotor)?.nombre;
  };
  const findTerminada = (idArt) => {
    return Ordenes?.find((ord) => ord.idArticulo === idArt)?.terminada;
  };
  const findOrden = (idArt) => {
    return Ordenes?.find((ord) => ord.idArticulo === idArt);
  };
  const findNamePos = (idPos) => {
    return Posiciones?.find((pos) => pos.posicionId === idPos)?.posicion;
  };
  const findNameTipoCadena = (idTipoCadena) => {
    return TiposCadenas?.find((cad) => cad.idTipoCadena === idTipoCadena)
      .tipoCadena;
  };

  const findTela = (IdTela) => {
    return TiposTelas?.find((Tela) => Tela.id === IdTela);
  };
  const findTelaTradi = (IdTela) => {
    return TiposTelasTradi?.find((Tela) => Tela.id === IdTela);
  };
  const [Cadena, setCadena] = useState("");

  /* const AddCor = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const nuevaCortinaRoler = {
      Ambiente: selectedAreaRoler,
      IdTipoTela: selectedTelaRoler.Id,
      ancho: AnchoRoller,
      alto: LargoRoller,
      Posicion: AdlAtr,
      LadoCadena: IzqDer,
      cadena: Cadena,
      Tubo: CanoRoller,
      motorizada: motorizada,
    };

    requestOptions.body = JSON.stringify(nuevaCortinaRoler);

    console.log(nuevaCortinaRoler);
    const url = UrlAddCor + "/" + Ven.Id;
    console.log(url);
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        console.error("Error en cortinas roller");
      } else {
        CancelarAddCor();
        FetchVentaCortinas();
      }

      console.log("result de cortina", result);
      //AgregarCortinaRollerAVenta(result.id, idVenta);
    } catch (error) {
      console.error("Error en cortinas roller:", error);
    }
  };*/

  <style>
    {`
  .hover-gray:hover {
    background-color: #f0f0f0; /* Gris claro */
    cursor: pointer;
  }
`}
  </style>;

  const GetConfiguracionArticulos = () => {
    const listaArticulos = [];
    Articulos.forEach((cor) => {
      // Deep copy of the original `cor` object to avoid modifying the original
      const newCor = JSON.parse(JSON.stringify(cor));

      if (cor.nombre === "Roller") {
        const nameMotor = findNameMotor(newCor.MotorRoller.idMotor);
        console.log("nameMotor", nameMotor);
        newCor.MotorRoller.nombre = nameMotor;
        console.log("newCor.MotorRoller.nombre", newCor.MotorRoller.nombre);
        newCor.TipoCadena.tipoCadena = findNameTipoCadena(
          newCor.TipoCadena?.idTipoCadena
        );
        newCor.cano.tipo = findNameCano(newCor.cano.id);
        newCor.posicion.posicion = findNamePos(newCor.posicion.posicionId);
        newCor.ladoCadena.lado = findNameLadoCadena(newCor.ladoCadena.ladoId);
        const telaArt = TiposTelas?.find(
          (tela) => tela.id === newCor.IdTipoTela
        );
        newCor.nombreTela = telaArt?.nombre;
        newCor.colorTela = telaArt?.color;
      }
      if (cor.nombre === "Romana") {
        newCor.ladoCadena.lado = findNameLadoCadena(newCor.ladoCadena.ladoId);
        const telaArt = TiposTelasTradi?.find(
          (tela) => tela.id === newCor.IdTipoTela
        );
        newCor.nombreTela = telaArt?.nombre;
        newCor.colorTela = telaArt?.color;
      }
      if (newCor.nombre === "Riel") {
        newCor.ladoAcumula.nombre = findNameladoAcumula(
          newCor.ladoAcumula.ladoAcumulaId
        );
        newCor.tipoRiel.tipo = findNameTipoRiel(newCor.tipoRiel.tipoId);
      }
      if (newCor.nombre === "Tradicional") {
        console.log("contenido", contenido);
        newCor.nombreTela = findTelaTradi(newCor.IdTipoTela)?.nombre;
        newCor.coloTela = findTelaTradi(newCor.IdTipoTela)?.color;
        newCor.Pinza.nombre = findNameTipoPinza(newCor.Pinza?.idPinza);
        newCor.ganchos.nombre = findNameTipoGancho(newCor.ganchos?.idGanchos);
      }

      console.log("ArticuloDesp", newCor);

      listaArticulos.push(newCor);
    });
    return listaArticulos;
  };

  const EditRiel = () => {
    setopenEdit(true);
    setRielEdited(RielTryEdited);
    handleClose();
  };

  const EditCor = () => {
    setopenEdit(true);
    if (CortrtinaTrtyEdited) {
      console.log(CortrtinaTrtyEdited);
      setRielEdited(null);
      setTradiEdited(null);
      setCortrtinaEdited(CortrtinaTrtyEdited);
    }
    if (TradicionalTryEdited) {
      setCortrtinaEdited(null);
      setRielEdited(null);
      setTradiEdited(TradicionalTryEdited);
    }
    if (RielTryEdited) {
      setTradiEdited(null);
      setCortrtinaEdited(null);
      setRielEdited(RielTryEdited);
    }
    handleClose();
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Retorna solo la parte Base64
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob); // Lee el blob como Data URL
    });
  };

  const callBacktoast = (mensaje, tipo) => {
    callBackToast(mensaje, tipo);
  };

  const imprimirContenido = (tradicionales, datosHeader) => {
    const grupos = agruparDeA4(tradicionales);
    const htmlCompleto = grupos
      .map((grupo, idx) => {
        // Solo agrega page-break si NO es el último grupo
        const pageBreak =
          idx < grupos.length - 1
            ? '<div style="page-break-after: always;"></div>'
            : "";
        return generarPaginaTradicionales(grupo, datosHeader) + pageBreak;
      })
      .join("");

    const opt = {
      margin: 0.5,
      filename: `${datosHeader.cliente}_Orden de Corte Tradicionales ${datosHeader.fecha}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(htmlCompleto).set(opt).save();
  };
  const descargarComoPDF = (html, nombreArchivo = "documento.pdf") => {
    const opt = {
      margin: 0.5,
      filename: nombreArchivo,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(html).set(opt).save();
  };
  function generarPaginaTradicionales(tradicionales, datosHeader) {
    return `
      <div style="width: 100%; box-sizing: border-box; padding: 20px 10px 10px 10px;">
        <div style="margin-bottom: 10px;">
          <div style="font-weight: bold; font-size: 15px;">
            Fecha Instalación: ${datosHeader.fechaInstalacion || "A confirmar"}
          </div>
          <div style="margin: 5px 0;">
        <img src="ImgLogo2.png" alt="Logo" style="height: 62px; float: right; margin-top: -20px;" />
          </div>
          <div style="font-size: 15px;">Cliente: ${datosHeader.cliente}</div>
          <div style="font-size: 15px;">Obra: ${datosHeader.obra || "N/A"}</div>
        </div>
        <div style="
          width: 100%; 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          grid-template-rows: 1fr 1fr; 
          gap: 8px;
        ">
          ${tradicionales
            .map(
              (trad) => `
            <div style="
              width: 100%; 
              height: auto; 
              border: 1px solid #ccc; 
              padding: 6px;
              overflow: auto;
              box-sizing: border-box;
              font-size: 18px;
            ">
              ${trad.contenidoProduccion || ""}
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
  function agruparDeA4(array) {
    const grupos = [];
    for (let i = 0; i < array.length; i += 4) {
      grupos.push(array.slice(i, i + 4));
    }
    return grupos;
  }

  const DescPdf = () => {
    if (Ven.listaArticulos.length > 0) {
      const datos = {
        fechaInst: Ven.fechaInstalacion,
        obra: Ven.obra.nombre,
        cliNomb: Ven.obra.cliente.nombre,
      };
      let datosHeader = {
        fecha: Ven.fecha,
        fechaInstalacion: Ven.fechaInstalacion,
        cliente: Ven.obra.cliente.nombre,
        obra: Ven.obra.nombre,
      };
      const ven = {
        fecha: Ven.fecha,
        listaArticulos: GetConfiguracionArticulos(),
        Datos: datos,
      };
      let tradicionales = ven.listaArticulos.filter(
        (art) => art.nombre === "Tradicional"
      );
      if (tradicionales.length >= 1) {
        imprimirContenido(tradicionales, datosHeader);
      }

      if (ven.listaArticulos.some((art) => art.nombre !== "Tradicional")) {
        downloadPDF(ven);
      }
    } else {
      callBackToast("no se encontraron articulos", "error");
    }
  };

  const DescPdfInstalacion = () => {
    const ven = {
      Cliente: Ven.obra.cliente,
      listaArticulos: GetConfiguracionArticulos(),
    };

    downloadPDFInstalacion(ven);
  };

  const Setpaso = async () => {
    setloadingSetPaso(true);
    const idPasoOrden = findOrden(CortrtinaTrtyEdited.IdArticulo).idPasoOrden;
    console.log("idPasoOrden", idPasoOrden);
    const url =
      "http://200.40.89.254:8081/Orden/PasoOrden/Completar/" + idPasoOrden;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      console.log(result);
      setConfirmPaso();
      setShowModal(false);
    } catch (error) {
      console.error("Error actualizando el paso:", error);
    } finally {
      setloadingSetPaso(false);
    }
  };

  const DeSetpaso = async () => {
    setloadingSetPaso(true);
    const idPasoOrden = findOrden(CortrtinaTrtyEdited.IdArticulo).idPasoOrden;
    console.log("idPasoOrden", idPasoOrden);
    const url =
      "http://200.40.89.254:8081/Orden/PasoOrden/DesCompletar/" + idPasoOrden;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      console.log(result);
      setUndoPaso();
      setShowModal(false);
    } catch (error) {
      console.error("Error actualizando el paso:", error);
    } finally {
      setloadingSetPaso(false);
    }
  };

  const downloadPDFInstalacion = async (Ven) => {
    const blob = await pdf(<OrdenInstalacion Venta={Ven} />).toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    console.log("VenVen", Ven);
    link.download = `${Ven.Cliente.nombre} O.I.pdf`;

    // Simular el clic en el enlace de descarga
    link.click();

    // Liberar la URL del objeto
    URL.revokeObjectURL(link.href);
  };

  const downloadPDF = async (Ven) => {
    console.log("VenVen", Ven);
    const contieneRoller = Ven.listaArticulos.some(
      (art) => art.nombre === "Roller"
    );

    if (contieneRoller) {
      // Crear una copia profunda de Ven para no mutar el original
      const venRoller = {
        ...Ven,
        listaArticulos: Ven.listaArticulos.filter(
          (art) => art.nombre === "Roller"
        ),
      };

      // Generar y descargar el PDF
      const blob = await pdf(<OrdenProduccion Venta={venRoller} />).toBlob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${Ven.Datos.cliNomb} Orden De Corte ROLLERS ${Ven.fecha}.pdf`;
      document.body.appendChild(link); // Añadirlo al DOM por compatibilidad
      link.click();
      document.body.removeChild(link); // Quitarlo del DOM

      setTimeout(() => URL.revokeObjectURL(link.href), 100); // Limpieza posterior
    }

    const contieneRiel = Ven.listaArticulos.some(
      (art) => art.nombre === "Riel"
    );

    if (contieneRiel) {
      // Crear una copia profunda de Ven para no mutar el original
      const venRiel = {
        ...Ven,
        listaArticulos: Ven.listaArticulos.filter(
          (art) => art.nombre === "Riel"
        ),
      };

      // Generar y descargar el PDF
      const blob = await pdf(<OrdenProduccion Venta={venRiel} />).toBlob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${Ven.Datos.cliNomb} Orden De Corte Riel ${Ven.fecha}.pdf`;
      document.body.appendChild(link); // Añadirlo al DOM por compatibilidad
      link.click();
      document.body.removeChild(link); // Quitarlo del DOM

      setTimeout(() => URL.revokeObjectURL(link.href), 100); // Limpieza posterior
    }

    const contieneRomana = Ven.listaArticulos.some(
      (art) => art.nombre === "Romana"
    );

    if (contieneRomana) {
      // Crear una copia profunda de Ven para no mutar el original
      const venRomana = {
        ...Ven,
        listaArticulos: Ven.listaArticulos.filter(
          (art) => art.nombre === "Romana"
        ),
      };

      // Generar y descargar el PDF
      const blob = await pdf(<OrdenProduccion Venta={venRomana} />).toBlob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${Ven.Datos.cliNomb} Orden De Corte Romanas ${Ven.fecha}.pdf`;
      document.body.appendChild(link); // Añadirlo al DOM por compatibilidad
      link.click();
      document.body.removeChild(link); // Quitarlo del DOM

      setTimeout(() => URL.revokeObjectURL(link.href), 100); // Limpieza posterior
    }
  };
  const ObtenerFecha = (fecha) => {
    const date = new Date(fecha);

    // obtener día y mes con padStart para que tengan 2 dígitos
    const dia = date.getDate(); // número: 23
    const diamasuno = String(dia + 1).padStart(2, "0"); // "24"
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    return `${diamasuno}-${mes}`;
  };

  const downloadTicket = async () => {
    console.log("Ven", Ven);
    console.log("CortinasRoller", Rollers);
    // Generar el documento PDF utilizando la función `pdf`
    //setloadingTicket(true);

    const blob = await pdf(
      <TicketCortina
        NombreCli={Ven.obra.cliente.nombre}
        Articulos={GetConfiguracionArticulos()}
      />
    ).toBlob();
    const base64PDF = await blobToBase64(blob);
    // Crear un enlace de descarga
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${Ven.obra.cliente.nombre} ETQ.pdf`;

    // Simular el clic en el enlace de descarga
    link.click();

    // Liberar la URL del objeto
    URL.revokeObjectURL(link.href);
    //setloadingTicket(false);
  };

  const confirmEditVen = async () => {
    // Validaciones previas
    if (!Ven?.id) {
      callBackToast("Error: No se encontró la venta", "error");
      return;
    }

    setloadingAct(true);

    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      // Construir URL de manera más segura
      const fechaParam = FechaInstEdit || "null";
      const obraParam = ObraEdit?.trim() || "null";
      const direccionParam = DireccionEdit?.trim() || "null";
      const IdObra = Ven.obra.idObra;
      const url = `${VentasEpUpdate}${fechaParam}/${obraParam}/${direccionParam}/${Ven.id}/${IdObra}`;
      console.log("url", url);

      const response = await fetch(url, requestOptions);

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (result.status === "OK") {
        // Crear una copia profunda de Ven antes de modificarlo
        const NewVenta = JSON.parse(JSON.stringify(Ven));

        // Actualizar solo los campos que cambiaron
        if (ObraEdit?.trim() !== "") {
          NewVenta.obra = { ...NewVenta.obra, nombre: ObraEdit.trim() };
        }
        if (FechaInstEdit && FechaInstEdit !== "null") {
          NewVenta.obra = { ...NewVenta.obra, fechaInstalacion: FechaInstEdit };
        }

        dispatch(setVenta(NewVenta));
        callBackToast("Venta actualizada correctamente", "success");
        setEditVen(false);
      } else {
        // Manejar diferentes tipos de errores del servidor
        const errorMessage =
          result.message || result.error || "Error desconocido del servidor";
        callBackToast(`Error al actualizar: ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Error en confirmEditVen:", error);

      // Mensajes de error más específicos
      let errorMessage = "Error al actualizar la venta";

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        errorMessage = "Error de conexión. Verifique su conexión a internet.";
      } else if (error.message.includes("HTTP error")) {
        errorMessage = "Error del servidor. Intente nuevamente.";
      } else if (error.message.includes("JSON")) {
        errorMessage = "Error en el formato de respuesta del servidor.";
      }

      callBackToast(errorMessage, "error");
    } finally {
      setloadingAct(false);
    }
  };

  const getBorder = () => {
    if (!CortrtinaTrtyEdited?.IdArticulo) return "none";
    return findTerminada(CortrtinaTrtyEdited?.IdArticulo)
      ? "5px solid green"
      : "5px solid red";
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "1px solid black",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEnforceFocus
        disableAutoFocus
      >
        <Box sx={style}>
          <div>
            <div>
              <h2>
                {CortrtinaTrtyEdited && CortrtinaTrtyEdited.nombre}{" "}
                {RielTryEdited && RielTryEdited.nombre}
              </h2>
            </div>
            {CortrtinaTrtyEdited && (
              <Table responsive>
                <thead
                  style={{
                    justifyContent: "center",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <tr>
                    <th>Tipo</th>
                    <th>Ambiente</th>
                    <th>Tela</th>
                    <th>Color</th>
                    <th>Ancho AF-AF</th>
                    <th>Ancho tela</th>
                    <th>Ancho Caño</th>
                    <th>Caño</th>
                    <th>Alto Cortina</th>
                    <th>Alto Tela</th>
                    <th>Cant</th>
                    <th>Cadena</th>
                    <th>Lado Cadena</th>
                    <th>Posición</th>
                  </tr>
                </thead>
                <tbody>
                  {CortrtinaTrtyEdited && (
                    <tr key={CortrtinaTrtyEdited.idRoller}>
                      <td>{CortrtinaTrtyEdited.nombre}</td>
                      <td>{CortrtinaTrtyEdited.Ambiente}</td>
                      <td>
                        {findTela(CortrtinaTrtyEdited.IdTipoTela)?.nombre ||
                          null}
                      </td>
                      <td>{findTela(CortrtinaTrtyEdited.IdTipoTela)?.color}</td>
                      <td>{CortrtinaTrtyEdited.ancho}</td>
                      <td>{CortrtinaTrtyEdited.AnchoTela}</td>
                      <td>{CortrtinaTrtyEdited.AnchoTubo}</td>
                      <td>{findNameCano(CortrtinaTrtyEdited.cano.id)}</td>
                      <td>{CortrtinaTrtyEdited.alto}</td>
                      <td>{CortrtinaTrtyEdited.AltoTela}</td>
                      <td>1</td>
                      <td>{CortrtinaTrtyEdited.LargoCadena}</td>
                      <td>
                        {findNameLadoCadena(
                          CortrtinaTrtyEdited.ladoCadena.ladoId
                        )}
                      </td>
                      <td>
                        {findNamePos(CortrtinaTrtyEdited.posicion.posicionId)}
                      </td>
                      
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
            {ShowModalConfirmPaso && (
              <>
                <Button variant="secondary" onClick={handleClose}>
                  Cancelar
                </Button>
                {findTerminada(CortrtinaTrtyEdited.IdArticulo) ? (
                  <Button variant="primary" onClick={() => Setpaso()}>
                    Terminar
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => DeSetpaso()}>
                    Deshacer
                  </Button>
                )}
              </>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Button variant="secondary" onClick={handleClose}>
                Volver
              </Button>

              <div>
                {CortrtinaTrtyEdited?.IdArticulo && (
                  <div
                    style={{
                      backgroundColor: findTerminada(
                        CortrtinaTrtyEdited.IdArticulo
                      )
                        ? "#d4edda"
                        : "#f8d7da",
                      color: findTerminada(CortrtinaTrtyEdited.IdArticulo)
                        ? "#155724"
                        : "#721c24",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {findTerminada(CortrtinaTrtyEdited.IdArticulo)
                      ? "Terminada"
                      : "Sin terminar"}
                  </div>
                )}
              </div>
              {loadingSetPaso ? (
                <Loading tipo="small" />
              ) : findTerminada(CortrtinaTrtyEdited?.IdArticulo) ? (
                <Button variant="primary" onClick={() => DeSetpaso()}>
                  Deshacer
                </Button>
              ) : (
                <Button variant="primary" onClick={() => Setpaso()}>
                  Terminar
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Modal>

      {openEdit ? (
        <>
          {CortinaEdited && (
            <EditarCortina
              callBackCancel={ShowModalCallB}
              cortinaEdited={CortinaEdited}
              callBacktoast={callBacktoast}
              CortinaEditedFnct={CortinaEditedFnct}
            />
          )}
        </>
      ) : (
        <>
          <Row
            className="align-items-center py-3"
            style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
          >
            <Col className="text-center">
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#343a40",
                }}
              >
                {Ven.obra.cliente ? Ven.obra.cliente.nombre : null}
              </h1>
            </Col>
            <Col className="text-center">
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "500",
                  color: "#495057",
                }}
              >
                Instalación: {ObtenerFecha(Ven.fechaInstalacion)}
              </h3>
            </Col>
            <Col className="text-center">
              {Ven.obra.nombre && (
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "500",
                    color: "#495057",
                  }}
                >
                  Obra: {Ven.obra.nombre}
                </h3>
              )}
            </Col>
          </Row>
        </>
      )}
      {Rollers.length > 0 && (
        <>
          <Table responsive bordered>
            <thead
              style={{
                justifyContent: "center",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <tr>
                <th>Tipo</th>
                <th>Num</th>
                <th>Ambiente</th>
                <th>Tela</th>
                <th>Color</th>
                <th>Ancho tela</th>
                <th>Alto Tela</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {Rollers.map((Cor) => (
                <tr key={Cor.idRoller} onClick={() => handleShow(Cor)}>
                  <td className={findTerminada(Cor.IdArticulo) && "ter"}>
                    {Cor.nombre}
                  </td>
                  <td className={findTerminada(Cor.IdArticulo) && "ter"}>
                    {Cor.numeroArticulo}
                  </td>
                  <td className={findTerminada(Cor.IdArticulo) && "ter"}>
                    {Cor.Ambiente}
                  </td>
                  <td className={findTerminada(Cor.IdArticulo) && "ter"}>
                    {findTela(Cor.IdTipoTela)?.nombre || null}
                  </td>
                  <td className={findTerminada(Cor.IdArticulo) && "ter"}>
                    {findTela(Cor.IdTipoTela)?.color}
                  </td>
                  <td className={findTerminada(Cor.IdArticulo) && "ter"}>
                    {Cor.AnchoTela?.toFixed(3)}
                  </td>
                  <td className={findTerminada(Cor.IdArticulo) && "ter"}>
                    {Cor.AltoTela?.toFixed(3)}
                  </td>
                  <td className={findTerminada(Cor.IdArticulo) && "ter"}>
                    {findTerminada(Cor.IdArticulo)
                      ? "terminada"
                      : "sin terminar"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {Romanas.length !== 0 && (
        <>
          <Table responsive bordered className="table-romanas">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Num</th>
                <th>Ambiente</th>
                <th>Tela</th>
                <th>Color</th>
                <th>Ancho</th>
                <th>Ancho varilla y contrapeso</th>
                <th>Alto</th>
                <th>Caídas</th>
                <th>Lado</th>
                <th>Largo Cadena</th>
                <th>Varillas</th>
                <th>Dist Varillas</th>
              </tr>
            </thead>
            <tbody>
              {Romanas.map((romana) => (
                <tr key={romana.numeroArticulo}>
                  <td>{romana.nombre}</td>
                  <td>{romana.numeroArticulo}</td>
                  <td>{romana.Ambiente}</td>
                  <td>{findTelaTradi(romana.IdTipoTela)?.nombre}</td>
                  <td>{findTelaTradi(romana.IdTipoTela)?.color}</td>
                  <td>{romana.ancho?.toFixed(3)}</td>
                  <td>{romana.anchoVarilla?.toFixed(3)}</td>
                  <td>{romana.alto?.toFixed(3)}</td>
                  <td>{romana.caidas}</td>
                  <td>{findNameLadoCadena(romana.ladoCadena?.ladoId)}</td>
                  <td>{(romana.factorLargoCadena * romana.alto).toFixed(3)}</td>
                  <td>{romana.cantvarillas}</td>
                  <td>{romana.distanciavarillas}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      <Row>
        <Col className="d-flex justify-content-center">
          <Button variant="primary" onClick={DescPdf}>
            Orden
          </Button>
        </Col>
        <Col className="d-flex justify-content-center">
          <Button variant="primary" onClick={downloadTicket} className="w-auto">
            Tickets
          </Button>
        </Col>
      </Row>
    </>
  );
};
