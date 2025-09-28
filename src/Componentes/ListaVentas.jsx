import React from "react";
import { Row ,Col} from "react-bootstrap";
import { Loading } from "./Loading";
const ObtenerFecha =(fecha)=>{
  const date = new Date(fecha);
  const dia = date.getDate(); // número: 23
  const diamasuno = String(dia + 1).padStart(2, "0"); // "24"
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  return `${diamasuno}-${mes}`;
}

export const ListaVentas = ({ ventas, onSelectVenta, selectedVentaId }) => (
  
  <div style={{ }}>
    {ventas.sort(
  (a, b) => new Date(a.fechaInstalacion) - new Date(b.fechaInstalacion)
).map((Ven) => (
  ventas.length === 0 ?

    <Loading tipo="loading" />
    :
      <div
        key={Ven.id}
        className={`venta-card shadow-sm p-3 mb-4 bg-white rounded ${selectedVentaId === Ven.id ? "selected" : ""}`}
        onClick={() => onSelectVenta(Ven)}
        style={{
          cursor: "pointer",
          background: selectedVentaId === Ven.id ? "#e6f7ff" : "white",
          border: selectedVentaId === Ven.id ? "2px solid #1890ff" : "1px solid #eee"
        }}
      >
        <Row className="align-items-center">
          <Col className="col-8">
          <div 
            style={{ 
              fontSize: "30px", 
              color: Ven.estadoCorteTela === "TODOS TERMINADOS" ? "green" : "black" 
            }} 
            className="fw-bold"
          >
            {Ven.obra.cliente?.nombre}
          </div>
          <div className="text-muted">{Ven.obra.nombre && Ven.obra.nombre}</div>
          </Col>
          <Col className="col-4" style={{
            display: "flex",
            alignItems: "flex-end",
            fontSize: "25px"
          }}>
          <div>{Ven.fechaInstalacion && ObtenerFecha(Ven.fechaInstalacion)}</div>
          </Col>
        </Row>
      </div>
        
    ))}
  </div>
); 