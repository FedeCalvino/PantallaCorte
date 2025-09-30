import React, { useState, useEffect, useRef } from "react";
import { VentaViewPantallaCorte } from "../Componentes/VentaViewPantallaCorte.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  setArticulos,
  setVenta,
  selectVenta,
} from "../Features/VentaViewReucer.js";
import "./Css/Ventas.css";
import { Toaster, toast } from "react-hot-toast";
import {
  selectRollerConfig,
  selectConfigRiel,
} from "../Features/ConfigReducer.js";
import { Loading } from "../Componentes/Loading.jsx";
import {
  removeAllArticulos,
  selectArticulos,
} from "../Features/ArticulosReducer.js";
import { ListaVentas } from "../Componentes/ListaVentas.jsx";
import { Client } from '@stomp/stompjs';

export const PantallaCorteTela = () => {
  const [isLoading, setIsLoading] = useState(false);
  const Ven = useSelector(selectVenta);
  console.log(Ven)

  
  const dispatch = useDispatch();
  const [SearchText, setSearchText] = useState("");
  const [Tamano, setTamano] = useState("1");
  const [Ventas, setVentas] = useState([]);

  const [VentasTotales, setVentasTotales] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [ShowModalConfirmArt, setShowModalConfirmArt] = useState(false);
  const [VentaInfo, setVentaInfo] = useState(null);
  const [AddArt, setAddArt] = useState(false);
  const [Agregando, setAgregando] = useState(false);
  const Articulos = useSelector(selectArticulos);
  const idVenta = Ven.id;
  let lastDay = "";
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);
  const [Pagina, setPagina] = useState(0);
  const ConfigRoller = useSelector(selectRollerConfig);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [loadingVenta, setLoadingVenta] = useState(false);
  const [Ordenes, setOrdenes] = useState([]);
/*
    const UrlVentas = "/VentasEP/Activas";
    const UrlVenta = "/VentasEP/";
    const OrdenesUrl ="/OrdenEp/PantallaCorte"
*/

  const UrlVentas = "http://200.40.89.254:8081/Ventas/Activas";
  const UrlVenta = "http://200.40.89.254:8088/Ventas/";
  const UrlDelete = "http://200.40.89.254:8088/Ventas/";
  const OrdenesUrl ="http://200.40.89.254:8081/Orden/PantallaCorte"
  
  const setVentaView = async (Venta) => {
    setLoadingVenta(true);
    console.log(ConfigRoller);
    if (ConfigRoller.length != 0) {
      if (Venta.id != null) {
        setShowModal(true);
        setIsLoading(true);

        try {
          const res = await fetch(UrlVenta + Venta.id, {
            method: "GET",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzM4NzY4NjA3LCJleHAiOjE3Mzg3NzIyMDcsIm5vbWJyZSI6IjEyMzQ1In0.Ihx6ZdPhMp9xP8-5erZDkD5lUS-afw5SciY75OPweu2vtAAS4XMnVUX0yM02wggCcOqVhdzgcm18oV55y9kP0w`,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          console.log("articulos", data.body.listaArticulos);
          console.log(data.body);
          const filteredArticulos = data.body.listaArticulos.filter(
            (articulo) =>
              Ordenes.find(
                (orden) => orden.idArticulo === articulo.idArticulo
              )
          );
          dispatch(setArticulos(filteredArticulos));
          console.log("data.body", data.body);
          dispatch(setVenta(data.body));
          setVentaSeleccionada(data.body);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
          setLoadingVenta(false);
        }
      }
    } else {
      setLoadingVenta(false);
      toast.error("Las configuraciones de rollers no estan cargadas");
    }
  };

 

  const callBackAddArt = () => {
    setAddArt(true);
    setShowModal(false);
    dispatch(removeAllArticulos());
  };
  const sumarPagina = () => {
    console.log("Pagina", Pagina);
    FetchVentas(+1);
    setPagina((prev) => prev + 1);
  };
  const restarPagina = () => {
    FetchVentas(-1);
    setPagina((prev) => prev - 1);
  };
  const FetchVentas = async (adelanto, ordenes) => {
    setVentas([]);
    try {
      console.log("Pagina", Pagina);
      const nuevaPagina = parseInt(Pagina) + parseInt(adelanto);
      console.log(nuevaPagina);
      const res = await fetch(`${UrlVentas}`);
      const data = await res.json();
      console.log("dataaa", data);
      console.log("ordenes", ordenes);
      const filtered = data.body.filter((venta) =>
        ordenes.body.find((orden) => orden.idVentaa === venta.id)
      );
      
      const reFilterd = filtered.filter((venta) => {
        return (
          venta.fechaInstalacion !== null &&
          new Date(venta.fechaInstalacion) > new Date()
        );
      });
   
      const sortedData = reFilterd.sort(
        (a, b) => {
          new Date(b.fechaInstalacion) - new Date(a.fechaInstalacion)
        }
      );
    console.log("sortedData",sortedData)
      setVentas(sortedData);
      setVentasTotales(sortedData);
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar las ventas");
    }
  };

  const FetchOrdenes = async () => {
    
    const data = await fetch(OrdenesUrl);
    const response = await data.json();
    console.log("response ordenes", response);
    setOrdenes(response.body);
    return response;
  };
  const fetchs = async () => {
    console.log("llego el mensaje")
    const ordenes = await FetchOrdenes();
    FetchVentas(0, ordenes);
  };

  const connect = () => {
    const client = new Client({
      brokerURL: 'ws://200.40.89.254:8088/OrdenesSocket', 
      reconnectDelay: 5000, 
      debug: (msg) => console.log(msg), 
      onConnect: () => {
        console.log('Conexión WebSocket exitosa');
        // Suscribirse al canal
        client.subscribe('/topic/orders', (message) => {
          console.log('Mensaje recibido:', message.body);
          fetchs();
        });
      },
      onStompError: (frame) => {
        console.error('Error en STOMP:', frame);
      },
    });
  
    // Activar la conexión
    client.activate();
  };
  
  useEffect(() => {
    fetchs();
    connect();
  }, []);


  

  const MostrarDia = ({ Day }) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate() + 1).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    };

    let Ok = false;
    if (lastDay !== Day) {
      Ok = true;
      lastDay = Day;
    }

    return (
      <>
        {Ok && (
          <div className="day-header">
            <h3>{formatDate(Day)}</h3>
          </div>
        )}
      </>
    );
  };

  const groupedVentas = Ventas.reduce((acc, venta) => {
    const dateKey = venta.fecha.split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(venta);
    return acc;
  }, {});

  const FiltrarVentas = () => {
    if (SearchText.trim()) {
      const filtered = VentasTotales.filter((venta) =>
        venta.obra.cliente.nombre
          .toLowerCase()
          .includes(SearchText.toLowerCase())
      );
      setVentas(filtered);
    } else {
      setVentas(VentasTotales);
    }
  };

  useEffect(() => {
    FiltrarVentas();
    lastDay = "";
  }, [SearchText]);

  const handleClose = () => {
    setConfirmDelete(false);
    setShowModal(false);
    setIsLoading(false);
    setAddArt(false);
  };

  const handleCloseAddArt = () => {
    setConfirmDelete(false);
    setShowModal(true);
    setIsLoading(false);
    setAddArt(false);
  };
  const ConfirmPaso=()=>{
    fetchs()
  }
  const UndoPaso=()=>{
    fetchs()
  }
  const ConfirmAgregarArticulos = async () => {
    if (Articulos.length > 0) {
      setAgregando(true);
      const loadingToast = toast.loading("Cargando...");

      const VentaModel = {
        Articulos,
      };

      console.log("VentaModel", VentaModel);

      console.log("VentaModel", VentaModel);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Articulos),
      };

      console.log(Articulos);

      try {
        const response = await fetch(
          UrlVenta + "AddArt/" + Ven.id,
          requestOptions
        );

        console.log("Response:", response);

        if (!response.ok) {
          toast.dismiss(loadingToast);
          setCreando(false);
          toast.error("Error al crea la ventar");
          console.error("Error en la solicitud:", response.statusText);
          return;
        }
        toast.dismiss(loadingToast);
        setShowModal(false);
        setShowModalConfirmArt(false);
        const result = await response.json();
        setAgregando(false);
        console.log("Response Venta", result);
      } catch (error) {
        setAgregando(false);
        toast.dismiss(loadingToast);
        toast.error("Error al crea la ventar");
      }
    } else {
      setAgregando(false);
      setShowModal(false);
      toast.error("No hay articulos");
    }
  };

  const ObtenerFecha =(fecha)=>{
    const date = new Date(fecha);

    // obtener día y mes con padStart para que tengan 2 dígitos
    const dia = date.getDate(); // número: 23
    const diamasuno = String(dia + 1).padStart(2, "0"); // "24"
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    return `${diamasuno}-${mes}`;
  }

  const ConfirmAddArt = () => {
    const VentaInfoObj = {
      CliNombre: Ven.obra.cliente.Nombre,
      Obra: Ven.obra.nombre,
      FechaInstalacion: Ven.obra.fechaInstalacion,
    };
    setVentaInfo(VentaInfoObj);
    setAddArt(false);
    setShowModalConfirmArt(true);
  };

  const handleDelete = async () => {
    console.log(idVenta);
    if (idVenta != null) {
      setloadingDelete(true);
      const requestOptionsventa = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      try {
        const response = await fetch(UrlDelete + idVenta, requestOptionsventa);
        if (response.ok) {
          setloadingDelete(false);
          handleClose();
          FetchVentas(0);
          toast.success("venta eliminada");
        } else {
          toast.error("error al eliminar");
          console.error("Error al eliminar la venta", response.status);
          setloadingDelete(false);
        }
      } catch (error) {
        toast.error("error al eliminar", error);
        setloadingDelete(false);
        console.error("Error al realizar la solicitud", error);
      }
    }
  };

  const [toastloading, settoastloading] = useState(null);

  const callBackToast = (mensaje, tipo) => {
    if (tipo === "error") {
      toast.error(mensaje);
    }
    if (tipo === "success") {
      toast.success(mensaje);
    }
  };

  return (
    <div
      className="proximas-ventas-layout"
      style={{ display: "flex", height: "100vh" }}
    >
      {/* Lista de ventas a la izquierda */}
      <div
        style={{ flex: 1, borderRight: "1px solid #eee", overflowY: "auto" }}
      >
        <ListaVentas
          ventas={Ventas}
          onSelectVenta={setVentaView}
          selectedVentaId={ventaSeleccionada?.id}
        />
      </div>
      {/* Detalle a la derecha, con transición */}
      <div
        className={`venta-detalle-panel${ventaSeleccionada ? " visible" : ""}`}
        style={{
          flex: 3,
          minWidth: 0,
          transition: "transform 0.4s cubic-bezier(.4,0,.2,1)",
          transform: ventaSeleccionada ? "translateX(0)" : "translateX(100%)",
          background: "#fff",
          boxShadow: ventaSeleccionada
            ? "-4px 0 16px rgba(0,0,0,0.08)"
            : "none",
          overflowY: "auto",
        }}
      >
        {loadingVenta ? (
          <div className="text-center" style={{ marginTop: "300px" }}>
            <Loading tipo="loading" />
          </div>
        ) : (
          ventaSeleccionada && (
            <VentaViewPantallaCorte
              callBackToast={callBackToast}
              venta={ventaSeleccionada}
              ConfirmPaso={true}
              setConfirmPaso={ConfirmPaso}
              setUndoPaso={UndoPaso}
              Ordenes={Ordenes}
            />
          )
        )}
      </div>
    </div>
  );
};
