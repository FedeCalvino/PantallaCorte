import React, { useEffect, useState } from "react";
import { Table, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../Routes/Css/EditarCortina.css";
import { selectRollerConfig } from "../Features/ConfigReducer";
import { selectTelasRoller } from "../Features/TelasReducer";

export const EditarCortina = ({
  callBackCancel,
  cortinaEdited,
  callBacktoast,
  CortinaEditedFnct,
}) => {
  const ConfigRoller = useSelector(selectRollerConfig);
  const CanosRoller = ConfigRoller.canos;
  const LadosCadenas = ConfigRoller.ladosCadena;
  const Posiciones = ConfigRoller.posiciones;
  const TiposTelas = useSelector(selectTelasRoller);
  //const EditarCortinaUrl = "/CortinaEp/";
  
  const EditarCortinaUrl = "http://localhost:8086/Cortina/";
  const [Cortina, setCortina] = useState(cortinaEdited);
  const [ComentarioIns, setComentarioIns] = useState(
    Cortina.detalleInstalacion
  );

  useEffect(() => {
    setCortina(cortinaEdited);
  }, [cortinaEdited]);

  const handleInputChange = (e, field) => {
    const value =
      field === "cano" || field === "ladoCadena" || field === "posicion"
        ? JSON.parse(e.target.value)
        : e.target.value;

    setCortina((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const transformarCortina = (cortina) => {
    console.log(cortina);

    const soporteObj = {
      idTipo: cortina.soporte.idTipo,
      cantidad: cortina.soporte.cantidad,
    };
    return {
      Ambiente: cortina.Ambiente,
      IdTipoTela: cortina.IdTipoTela,
      Ancho: cortina.ancho,
      Alto: cortina.alto,
      IdArticulo:cortina.IdArticulo,
      Posicion: parseInt(cortina.posicion.posicionId, 10),
      LadoCadena: parseInt(cortina.ladoCadena.ladoId, 10),
      cano: parseInt(cortina.cano.id, 10),
      motor: parseInt(cortina.motorRoller.idMotor, 10),
      cadena: parseInt(cortina.tipoCadena.idTipoCadena, 10),
      soporte: soporteObj,
      tipoArticulo: cortina.tipoArticulo,
      factorLargoCadena:cortina.factorLargoCadena,
      nombre: cortina.nombre,
      detalleInstalacion: ComentarioIns,
    };
  };

  const handleConfirmEdit = () => {
    Editar();
  };

  const Editar = async () => {
    try {
      const cor = transformarCortina(Cortina);

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cor),
      };

      const response = await fetch(
        EditarCortinaUrl + Cortina.IdCortina,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      callBacktoast("cortina actualizada", "success");
      CortinaEditedFnct();
    } catch (error) {
      console.log(error);
      callBacktoast("error al actualizar", "error");
    }
  };

  const findTela = (IdTela) =>
    TiposTelas.find((Tela) => Tela.id === IdTela) || {};
  const tela = findTela(Cortina.IdTipoTela);

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ambiente</th>
            <th>Tela</th>
            <th>Color</th>
            <th>Ancho</th>
            <th>Ancho Tela</th>
            <th>Ancho Tubo</th>
            <th>Caño</th>
            <th>Alto</th>
            <th>Alto Tela</th>
            <th>Cantidad</th>
            <th>Lado Cadena</th>
            <th>Posición</th>
            <th>Exterior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{Cortina.nombre}</td>
            <td>
              <input
                type="text"
                value={Cortina.Ambiente}
                size={15}
                onChange={(e) => handleInputChange(e, "Ambiente")}
              />
            </td>
            <td>{tela.nombre}</td>
            <td>{tela.color}</td>
            <td>
              <input
                type="text"
                size={5}
                value={Cortina.ancho}
                onChange={(e) => handleInputChange(e, "ancho")}
              />
            </td>
            <td>{Cortina.AnchoTela}</td>
            <td>{Cortina.AnchoTubo}</td>
            <td>
              <Form.Select
                value={JSON.stringify(Cortina.cano)}
                onChange={(e) => handleInputChange(e, "cano")}
                style={{ width: "80px" }}
              >
                {CanosRoller.map((cano) => (
                  <option key={cano.id} value={JSON.stringify(cano)}>
                    {cano.tipo}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <input
                type="text"
                value={Cortina.alto}
                size={10}
                onChange={(e) => handleInputChange(e, "alto")}
              />
            </td>
            <td>{Cortina.AltoTela}</td>
            <td>1</td>
            <td>
              <Form.Select
                value={JSON.stringify(Cortina.ladoCadena)}
                onChange={(e) => handleInputChange(e, "ladoCadena")}
              >
                {LadosCadenas.map((lado) => (
                  <option key={lado.ladoId} value={JSON.stringify(lado)}>
                    {lado.lado}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <Form.Select
                value={JSON.stringify(Cortina.posicion)}
                onChange={(e) => handleInputChange(e, "posicion")}
              >
                {Posiciones.map((pos) => (
                  <option key={pos.posicionId} value={JSON.stringify(pos)}>
                    {pos.posicion}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>{Cortina.Exterior ? "Sí" : "No"}</td>
          </tr>
        </tbody>
      </Table>
      <div>
        <Row >
          <Col className="d-flex justify-content-center" >
            <FloatingLabel
              controlId="floatingTextarea2"
              label="Detalles instalacion"
            >
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{
                  height: "150px",
                  width: "500px",
                  border: "1px solid black",
                  borderRadius: "5px",
                }}
                value={ComentarioIns}
                onChange={(e) => setComentarioIns(e.target.value)}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col>
            <button className="Butooneditable" onClick={Editar}>
              Confirmar
            </button>
          </Col>
          <Col>
            <button className="Butooneditable" onClick={callBackCancel}>
              Cancelar
            </button>
          </Col>
        </Row>
      </div>
    </>
  );
};
/*

*/
