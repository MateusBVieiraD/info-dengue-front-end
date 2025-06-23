# Exemplo de Configuração do Backend Python (FastAPI)

## 1. Estrutura Atual do Seu Backend ✅

Seu backend já está bem estruturado! O código que você mostrou está correto:

```python
from app.service.avaliar import avaliar_dados_paciente
from fastapi import APIRouter, Query, HTTPException, Form, Body
from app.model.avaliacao_response import AvaliacaoResponse

router = APIRouter()

@router.get("/avaliar", response_model=AvaliacaoResponse)
def avaliar(
    genero: str = Query(...),
    idade: int = Query(...),
    igg: float = Query(...),
    igm: float = Query(...),
    area: str = Query(...),
    areat: str = Query(...),
    casat: str = Query(...),
):
    resultado = avaliar_dados_paciente(idade, genero, igg, igm, area, areat, casat)
    return AvaliacaoResponse(
        idade=idade,
        genero=genero,
        igg=igg,
        igm=igm,
        area=area,
        areat=areat,
        casat=casat,
        avaliacao=resultado
    )
```

## 2. Modelo Pydantic ✅

```python
from pydantic import BaseModel

class AvaliacaoResponse(BaseModel):
    idade: int
    genero: str
    igg: float
    igm: float
    area: str
    areat: str
    casat: str
    avaliacao: str
```

## 3. Configuração CORS Necessária 🔧

Certifique-se de que seu backend tem CORS configurado para permitir requisições do frontend:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # URL do Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
```

## 4. Exemplo de Resposta JSON que o Frontend Espera

```json
{
  "idade": 25,
  "genero": "feminino",
  "igg": 1.2,
  "igm": 0.8,
  "area": "Vila Madalena, São Paulo",
  "areat": "urbana",
  "casat": "apartamento",
  "avaliacao": "Com base nos dados informados, há indícios de infecção recente por dengue. Recomenda-se procurar atendimento médico imediatamente."
}
```

## 5. Como Testar a Integração

### No Backend:
1. Execute seu servidor FastAPI
2. Teste o endpoint diretamente: `GET /avaliar?genero=feminino&idade=25&igg=1.2&igm=0.8&area=teste&areat=urbana&casat=casa`
3. Verifique se retorna o JSON estruturado

### No Frontend:
1. Execute `npm run dev` 
2. Preencha o formulário
3. Clique em "Consultar"
4. Verifique no console do navegador se os dados estão chegando corretamente
5. O modal deve exibir os dados organizados

## 6. Melhorias Sugeridas (Opcionais)

### A. Validação mais robusta no backend:
```python
from pydantic import validator

class AvaliacaoResponse(BaseModel):
    idade: int
    genero: str
    igg: float
    igm: float
    area: str
    areat: str
    casat: str
    avaliacao: str
    
    @validator('idade')
    def validate_idade(cls, v):
        if v < 0 or v > 120:
            raise ValueError('Idade deve estar entre 0 e 120 anos')
        return v
    
    @validator('genero')
    def validate_genero(cls, v):
        if v.lower() not in ['masculino', 'feminino', 'outro']:
            raise ValueError('Gênero deve ser masculino, feminino ou outro')
        return v.lower()
```

### B. Headers adicionais para ngrok:
```python
@router.get("/avaliar", response_model=AvaliacaoResponse)
def avaliar(
    genero: str = Query(...),
    idade: int = Query(...),
    igg: float = Query(...),
    igm: float = Query(...),
    area: str = Query(...),
    areat: str = Query(...),
    casat: str = Query(...),
):
    # Seu código atual...
    response = AvaliacaoResponse(...)
    
    # Headers para ngrok
    response.headers = {
        "ngrok-skip-browser-warning": "true",
        "Access-Control-Allow-Origin": "*"
    }
    
    return response
```

## 7. Debug - Se algo não funcionar

### Verifique no navegador (F12 -> Network):
- A requisição está sendo feita?
- Qual o status da resposta (200, 404, 500)?
- O JSON de resposta está correto?

### Verifique no console do navegador:
- Há erros de CORS?
- Os dados estão sendo logados corretamente?

### Logs do Backend:
- O endpoint está sendo chamado?
- Há erros na função `avaliar_dados_paciente`?

Seu backend já está bem estruturado! O frontend agora foi atualizado para receber e exibir corretamente os dados estruturados que você está retornando. 🚀
