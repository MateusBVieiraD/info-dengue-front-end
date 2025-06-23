import React, { useState } from "react";
import "./Inicio.css";

// Interface para a resposta do backend
interface AvaliacaoResponse {
  idade: number;
  genero: string;
  igg: number;
  igm: number;
  area: string;
  areat: string;
  casat: string;
  avaliacao: string;
}

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
  const [resultadoConsulta, setResultadoConsulta] = useState<AvaliacaoResponse | null>(null);
  const [upasModalOpen, setUpasModalOpen] = useState(false);
  const [upasProximas, setUpasProximas] = useState<any[]>([]);
  const [loadingUpas, setLoadingUpas] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Função para buscar UPAs próximas
  const buscarUpasProximas = async () => {
    if (!resultadoConsulta?.area) {
      alert("Endereço não encontrado. Faça uma nova consulta.");
      return;
    }

    setLoadingUpas(true);
    setUpasProximas([]);

    try {
      // URL do seu backend FastAPI
      const url = `http://127.0.0.1:8000/upas-proximas?endereco=${encodeURIComponent(resultadoConsulta.area)}&raio=10`;
      
      console.log("Buscando UPAs em:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const upas = await response.json();
        console.log("UPAs encontradas:", upas);
        setUpasProximas(Array.isArray(upas) ? upas : []);
        setUpasModalOpen(true);
      } else {
        const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }));
        console.error("Erro na resposta:", errorData);
        alert("Erro ao buscar UPAs próximas: " + (errorData.message || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro ao buscar UPAs:", error);
      alert("Erro de conexão ao buscar UPAs próximas.");
    } finally {
      setLoadingUpas(false);
    }
  };

  const converterValoresParaBackend = (formData: {
    genero: string;
    idade: string;
    igg: string;
    igm: string;
    area: string;
    areat: string;
    casat: string;
  }) => {
    const generoConvertido = formData.genero === "Masculino" ? "Male" : 
                            formData.genero === "Feminino" ? "Female" : 
                            formData.genero;
                            
    const areatConvertido = formData.areat === "Desenvolvida" ? "developed" : 
                           formData.areat === "Subdesenvolvida" ? "undeveloped" : 
                           formData.areat;

    const casatConvertido = formData.casat === "Casa Simples" ? "Tinshed" : 
                           formData.casat === "Casa" ? "Building" : 
                           formData.casat;
    
    return {
      ...formData,
      genero: generoConvertido,
      areat: areatConvertido,
      casat: casatConvertido
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setModalOpen(false);
    setResultadoConsulta(null);
    
    try {
      const formParaBackend = converterValoresParaBackend(form);
      
      const params = new URLSearchParams({
        genero: formParaBackend.genero,
        idade: formParaBackend.idade,
        igg: formParaBackend.igg,
        igm: formParaBackend.igm,
        area: formParaBackend.area,
        areat: formParaBackend.areat,
        casat: formParaBackend.casat,
      }).toString();

      const url = `http://127.0.0.1:8000/avaliar?${params}`;
      console.log("Fazendo requisição para:", url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        const data: AvaliacaoResponse = await response.json();
        console.log("Dados recebidos do backend:", data);
        setResultadoConsulta(data);
      } else {
        const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }));
        console.error("Erro na resposta:", errorData);
        alert("Erro ao realizar consulta: " + (errorData.message || "Erro desconhecido"));
      }
      setModalOpen(true);
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Erro de conexão com o servidor.");
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
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              fontSize: "1.2rem",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            {/* Spinner animado */}
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #007bff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <div style={{ color: "#333", fontWeight: "500" }}>
              Analisando seus dados...
            </div>
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
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>Resultado da Avaliação</h2>
            <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
              {/* Dados do Paciente */}
              <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>Dados Informados:</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.9rem" }}>
                  <div><strong>Gênero:</strong> {
                    resultadoConsulta.genero === "Male" ? "Masculino" : 
                    resultadoConsulta.genero === "Female" ? "Feminino" : 
                    resultadoConsulta.genero
                  }</div>
                  <div><strong>Idade:</strong> {resultadoConsulta.idade} anos</div>
                  <div><strong>IgG:</strong> {resultadoConsulta.igg}</div>
                  <div><strong>IgM:</strong> {resultadoConsulta.igm}</div>
                </div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  <div><strong>Área:</strong> {resultadoConsulta.area}</div>
                  <div><strong>Tipo de área:</strong> {
                    resultadoConsulta.areat === "developed" ? "Desenvolvida" : 
                    resultadoConsulta.areat === "undeveloped" ? "Subdesenvolvida" : 
                    resultadoConsulta.areat
                  }</div>
                  <div><strong>Tipo de casa:</strong> {
                    resultadoConsulta.casat === "Tinshed" ? "Casa Simples" : 
                    resultadoConsulta.casat === "Building" ? "Casa" : 
                    resultadoConsulta.casat
                  }</div>
                </div>
              </div>
              
              {/* Resultado da Avaliação */}
              <div style={{ 
                padding: "1rem", 
                backgroundColor: "#e8f4fd", 
                borderRadius: "6px",
                border: "1px solid #bee5eb"
              }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#0c5460" }}>Avaliação:</h4>
                <p style={{ 
                  margin: 0, 
                  fontSize: "1rem", 
                  lineHeight: "1.4",
                  color: "#0c5460",
                  fontWeight: "500"
                }}>
                  {resultadoConsulta.avaliacao}
                </p>
              </div>
            </div>
            
            {/* Container dos botões */}
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              marginTop: "1.5rem",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <button
                onClick={buscarUpasProximas}
                disabled={loadingUpas}
                style={{ 
                  padding: "0.75rem 2rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: loadingUpas ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  opacity: loadingUpas ? 0.6 : 1,
                  minWidth: "160px"
                }}
              >
                {loadingUpas ? "Buscando..." : "🏥 Ver UPAs Próximas"}
              </button>
              
              <button
                onClick={() => setModalOpen(false)}
                style={{ 
                  padding: "0.75rem 2rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  minWidth: "160px"
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de UPAs Próximas */}
      {upasModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              minWidth: "500px",
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              🏥 UPAs Próximas (até 10km)
            </h2>
            
            {upasProximas.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
                <p>Nenhuma UPA encontrada em um raio de 10km do seu endereço.</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Tente verificar se o endereço está correto ou consulte os serviços de saúde da sua região.
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                <p style={{ textAlign: "center", marginBottom: "1rem", color: "#666" }}>
                  Encontramos {upasProximas.length} UPA{upasProximas.length > 1 ? 's' : ''} próxima{upasProximas.length > 1 ? 's' : ''} ao seu endereço:
                </p>
                
                <div style={{ display: "grid", gap: "1rem", maxHeight: "300px", overflowY: "auto" }}>
                  {upasProximas.map((upa, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "1rem",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        backgroundColor: "#f8f9fa",
                        borderLeft: "4px solid #007bff",
                      }}
                    >
                      <h4 style={{ margin: "0 0 0.5rem 0", color: "#007bff" }}>
                        {upa.nome || `UPA ${index + 1}`}
                      </h4>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                        <strong>📍 Endereço:</strong> {upa.endereco || "Não informado"}
                      </p>
                      {upa.telefone && (
                        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                          <strong>📞 Telefone:</strong> {upa.telefone}
                        </p>
                      )}
                      {upa.distancia && (
                        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#28a745", fontWeight: "500" }}>
                          <strong>📏 Distância:</strong> {upa.distancia} km
                        </p>
                      )}
                      {upa.horario && (
                        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                          <strong>🕒 Horário:</strong> {upa.horario}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={() => setUpasModalOpen(false)}
              style={{ 
                marginTop: "1rem", 
                padding: "0.75rem 2rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500"
              }}
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
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o gênero</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
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
              placeholder="Digite seu endereço completo"
            />
          </div>
          <div className="inputs">
            <label>Tipo de área em que mora:</label>
            <select
              name="areat"
              value={form.areat}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo de área</option>
              <option value="Desenvolvida">Desenvolvida</option>
              <option value="Subdesenvolvida">Subdesenvolvida</option>
            </select>
          </div>
          <div className="inputs">
            <label>Tipo de casa em que mora:</label>
            <select
              name="casat"
              value={form.casat}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo de casa</option>
              <option value="Casa Simples">Casa Simples</option>
              <option value="Casa">Casa</option>
            </select>
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
