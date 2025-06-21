import React, { useState } from "react";
import "./Inicio.css";

function Inicio() {
  const [form, setForm] = useState({
    genero: "",
    idade: "",
    igg: "",
    igm: "",
    area: "",
    areat: "",
    casat: "",
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultadoConsulta, setResultadoConsulta] = useState<Record<string, unknown> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setModalOpen(false);
    setResultadoConsulta(null);
    try {
      const params = new URLSearchParams({
        genero: form.genero,
        idade: form.idade,
        igg: form.igg,
        igm: form.igm,
        area: form.area,
        areat: form.areat,
        casat: form.casat,
      }).toString();

      const url = `https://5802-2804-14c-65c1-48de-00-1002.ngrok-free.app/avaliar?${params}`;
      const response = await fetch(url);

      const data = await response.json();
        console.log(data);

      let isJson = false;
      try {
        isJson = true;
      } catch {
        console.log("");
        
      }
      if (response.ok) {
        if (isJson && typeof data === "object" && data !== null) {
          setResultadoConsulta(data as Record<string, unknown>);
        } else if (typeof data === "string") {
          setResultadoConsulta({ avaliacao: data });
        } else {
          setResultadoConsulta({ avaliacao: "Resposta inesperada da API." });
        }
      } else {
        setResultadoConsulta({
          avaliacao:
            typeof data === "string" ? data : "Erro ao realizar consulta.",
        });
      }
      setModalOpen(true);
    } catch {
      setResultadoConsulta({ avaliacao: "Erro de conexão." });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal de Loading */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              fontSize: "1.2rem",
            }}
          >
            Carregando...
          </div>
        </div>
      )}
      {/* Modal de Resposta Estruturada */}
      {modalOpen && resultadoConsulta && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              minWidth: "320px",
              maxWidth: "90vw",
              textAlign: "center",
              boxShadow: "0 2px 16px #0002",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Resultado da Avaliação</h2>
            <div style={{ textAlign: "left", marginBottom: "1rem" }}>
              {Object.entries(resultadoConsulta).map(([key, value]) => (
                <div key={key} style={{ marginBottom: 6 }}>
                  <b>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</b> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </div>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              style={{ marginTop: "1rem", padding: "0.5rem 1.5rem" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      <div className="container">
        <h3>
          Faça sua consulta no info-dengue com seus exames <br />
          para haveriguar se você possa estar contaminado.
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <label>Gênero:</label>
            <input
              type="text"
              name="genero"
              value={form.genero}
              onChange={handleChange}
            />
          </div>
          <div className="inputs">
            <label>Idade:</label>
            <input
              type="text"
              name="idade"
              value={form.idade}
              onChange={handleChange}
            />
          </div>
          <div className="inputs">
            <label>IgG:</label>
            <input
              type="text"
              name="igg"
              value={form.igg}
              onChange={handleChange}
            />
          </div>
          <div className="inputs">
            <label>IgM:</label>
            <input
              type="text"
              name="igm"
              value={form.igm}
              onChange={handleChange}
            />
          </div>
          <div className="inputs">
            <label>Área em que mora:</label>
            <input
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
            />
          </div>
          <div className="inputs">
            <label>Tipo de área em que mora:</label>
            <input
              type="text"
              name="areat"
              value={form.areat}
              onChange={handleChange}
            />
          </div>
          <div className="inputs">
            <label>Tipo de casa em que mora:</label>
            <input
              type="text"
              name="casat"
              value={form.casat}
              onChange={handleChange}
            />
          </div>
          <div className="botao">
            <button className="">Consultar</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Inicio;
