from fastapi import FastAPI, HTTPException
from schemas import Produto, DadoLogistico, LastroCamada, EmbalagemAuxiliar
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import crud as crud


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cadastro-logistico-1.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/produto/{ean_master}")
def get_produto(ean_master: str):
    produto = crud.buscar_produto(ean_master)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto

@app.post("/produto")
def criar(prod: Produto):
    if not crud.criar_produto(prod.ean_master, prod.descricao):
        raise HTTPException(status_code=400, detail="Produto já cadastrado")
    
    produto = crud.buscar_produto(prod.ean_master)
    return {"mensagem": "Produto cadastrado com sucesso", "id": produto["id"]}


@app.get("/verifica-produto-completo/{ean_master}")
def verificar_produto_completo(ean_master: str):
    resultado = crud.buscar_produto_completo(ean_master)
    return resultado

@app.post("/dados-logisticos")
def salvar_dados(dados: List[DadoLogistico]):
    crud.inserir_dados_logisticos(dados)
    return {"mensagem": "Dados logísticos salvos com sucesso"}

@app.post("/lastro-camada")
def salvar_lastro_camada(dados: LastroCamada):
    crud.inserir_lastro_camada(dados)
    return {"mensagem": "Lastro e camada salvos com sucesso"}

@app.get("/unidades")
def listar_unidades():
    return crud.buscar_unidades()


@app.post("/embalagens-auxiliares")
def post_embalagens_auxiliares(lista: list[EmbalagemAuxiliar]):
    crud.salvar_embalagens_auxiliares(lista)
    return {"status": "ok"}

@app.get("/dados-logisticos-por-ean/{ean}")
def buscar_dados_logisticos_por_ean(ean: str):
    return crud.buscar_dados_logisticos_por_ean(ean)

@app.get("/dados-logisticos-vendavel/{produto_id}")
def buscar_dados_logisticos_vendavel(produto_id: int):
    return crud.buscar_dados_logisticos_vendavel(produto_id)

@app.get("/embalagem-auxiliar/{produto_id}/{tipo_embalagem}")
def buscar_embalagem_auxiliar(produto_id: int, tipo_embalagem: str):
    return crud.buscar_embalagem_auxiliar(produto_id, tipo_embalagem)

@app.get("/lastro-camada/{produto_id}")
def buscar_lastro_camada(produto_id: int):
    return crud.buscar_lastro_camada(produto_id)


@app.get("/contador-produtos")
def contador_produtos():
    return crud.contador_produtos()