# 🏥 Modal de UPAs Próximas - Implementação Completa

## ✅ **Funcionalidades Implementadas no Frontend**

### **1. Estados Adicionados:**
```typescript
const [upasModalOpen, setUpasModalOpen] = useState(false);
const [upasProximas, setUpasProximas] = useState<any[]>([]);
const [loadingUpas, setLoadingUpas] = useState(false);
```

### **2. Função para Buscar UPAs:**
```typescript
const buscarUpasProximas = async () => {
  if (!resultadoConsulta?.area) {
    alert("Endereço não encontrado. Faça uma nova consulta.");
    return;
  }

  setLoadingUpas(true);
  setUpasProximas([]);

  try {
    const url = `http://127.0.0.1:8000/upas-proximas?endereco=${encodeURIComponent(resultadoConsulta.area)}&raio=10`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const upas = await response.json();
      setUpasProximas(Array.isArray(upas) ? upas : []);
      setUpasModalOpen(true);
    } else {
      alert("Erro ao buscar UPAs próximas.");
    }
  } catch (error) {
    alert("Erro de conexão ao buscar UPAs próximas.");
  } finally {
    setLoadingUpas(false);
  }
};
```

### **3. Botão no Modal de Resultado:**
```jsx
<button
  onClick={buscarUpasProximas}
  disabled={loadingUpas}
  style={{ 
    backgroundColor: "#28a745",
    color: "white",
    padding: "0.75rem 2rem",
    borderRadius: "6px",
    border: "none",
    cursor: loadingUpas ? "not-allowed" : "pointer",
    opacity: loadingUpas ? 0.6 : 1
  }}
>
  {loadingUpas ? "Buscando..." : "🏥 Ver UPAs Próximas"}
</button>
```

### **4. Modal de UPAs Próximas:**
- **Design responsivo** com scroll interno
- **Cards individuais** para cada UPA
- **Informações completas:** nome, endereço, telefone, distância, horário
- **Estado vazio** quando não há UPAs encontradas
- **Ícones visuais** para melhor UX

## 🐍 **Backend FastAPI - Endpoint Necessário**

### **1. Modelo Pydantic para UPA:**
```python
from pydantic import BaseModel
from typing import List, Optional

class UPA(BaseModel):
    nome: str
    endereco: str
    telefone: Optional[str] = None
    distancia: float
    horario: Optional[str] = None
```

### **2. Endpoint `/upas-proximas`:**
```python
from fastapi import APIRouter, Query, HTTPException
from geopy.distance import geodesic
from geopy.geocoders import Nominatim
import requests

router = APIRouter()

# Base de dados de UPAs (substitua por seu banco de dados real)
UPAS_DATABASE = [
    {
        "nome": "UPA 24h Vila Maria",
        "endereco": "Rua Conselheiro Moreira de Barros, 800 - Vila Maria",
        "telefone": "(11) 2631-1234",
        "latitude": -23.5089,
        "longitude": -46.5917,
        "horario": "24 horas"
    },
    {
        "nome": "UPA Cidade Tiradentes",
        "endereco": "Rua dos Têxteis, 1000 - Cidade Tiradentes",
        "telefone": "(11) 2045-5678",
        "latitude": -23.5965,
        "longitude": -46.4034,
        "horario": "24 horas"
    },
    {
        "nome": "UPA Jabaquara",
        "endereco": "Av. Engenheiro Armando de Arruda Pereira, 2314",
        "telefone": "(11) 5011-9999",
        "latitude": -23.6464,
        "longitude": -46.6425,
        "horario": "24 horas"
    }
]

@router.get("/upas-proximas", response_model=List[UPA])
async def buscar_upas_proximas(
    endereco: str = Query(..., description="Endereço do usuário"),
    raio: float = Query(10, description="Raio de busca em km")
):
    try:
        # Geocodificar o endereço do usuário
        geolocator = Nominatim(user_agent="info-dengue-app")
        location = geolocator.geocode(endereco)
        
        if not location:
            raise HTTPException(status_code=404, detail="Endereço não encontrado")
        
        usuario_coords = (location.latitude, location.longitude)
        print(f"Coordenadas do usuário: {usuario_coords}")
        
        # Calcular distâncias e filtrar UPAs próximas
        upas_proximas = []
        
        for upa in UPAS_DATABASE:
            upa_coords = (upa['latitude'], upa['longitude'])
            distancia = geodesic(usuario_coords, upa_coords).kilometers
            
            # Filtrar apenas UPAs dentro do raio especificado
            if distancia <= raio:
                upa_resultado = UPA(
                    nome=upa['nome'],
                    endereco=upa['endereco'],
                    telefone=upa.get('telefone'),
                    distancia=round(distancia, 1),
                    horario=upa.get('horario')
                )
                upas_proximas.append(upa_resultado)
        
        # Ordenar por distância
        upas_proximas.sort(key=lambda x: x.distancia)
        
        print(f"Encontradas {len(upas_proximas)} UPAs próximas")
        return upas_proximas
        
    except Exception as e:
        print(f"Erro ao buscar UPAs: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")
```

### **3. Instalação de Dependências:**
```bash
pip install geopy
```

### **4. Configuração CORS (main.py):**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
```

## 📋 **Exemplo de Resposta JSON Esperada**

```json
[
  {
    "nome": "UPA 24h Vila Maria",
    "endereco": "Rua Conselheiro Moreira de Barros, 800 - Vila Maria",
    "telefone": "(11) 2631-1234",
    "distancia": 2.3,
    "horario": "24 horas"
  },
  {
    "nome": "UPA Cidade Tiradentes",
    "endereco": "Rua dos Têxteis, 1000 - Cidade Tiradentes",
    "telefone": "(11) 2045-5678",
    "distancia": 4.7,
    "horario": "24 horas"
  }
]
```

## 🎯 **Fluxo Completo de Funcionamento**

1. **Usuário faz consulta** de avaliação de dengue
2. **Modal de resultado** aparece com botão "Ver UPAs Próximas"
3. **Usuário clica no botão**
4. **Frontend** faz requisição para `/upas-proximas` passando o endereço
5. **Backend** geocodifica o endereço e calcula distâncias
6. **Backend** retorna lista de UPAs ordenadas por proximidade
7. **Frontend** exibe **modal secundário** com as UPAs encontradas

## 🔧 **Para Implementar:**

### **No Backend:**
1. Adicione o endpoint `/upas-proximas` no seu router
2. Instale `geopy`: `pip install geopy`
3. Configure seu banco de dados de UPAs
4. Teste o endpoint: `GET http://127.0.0.1:8000/upas-proximas?endereco=São Paulo&raio=10`

### **No Frontend:**
1. O código já está implementado no arquivo `Inicio.tsx`
2. Certifique-se de que o backend está rodando
3. Teste a funcionalidade completa

## ✨ **Recursos Visuais Implementados:**

- **Modal overlay** com blur backdrop
- **Spinner de loading** durante busca
- **Cards responsivos** para cada UPA
- **Ícones informativos** (📍 📞 📏 🕒)
- **Estado vazio** elegante quando não há resultados
- **Animações suaves** de entrada/saída
- **Design consistente** com o resto da aplicação

**🚀 Implementação completa e pronta para uso!**
