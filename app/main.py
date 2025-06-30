from fastapi import FastAPI, HTTPException
from app.schemas import Produto, DadoLogistico, LastroCamada, EmbalagemAuxiliar
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import app.crud as crud


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.10.165:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/produto")
def criar(prod: Produto):
    if not crud.criar_produto(prod.ean_master, prod.descricao):
        raise HTTPException(status_code=400, detail="Produto já cadastrado")
    
    produto = crud.buscar_produto(prod.ean_master)
    return {"mensagem": "Produto cadastrado com sucesso", "id": produto["id"]}


@app.get("/verifica-produto/{ean_master}")
def verificar(ean_master: str):
    produto = crud.buscar_produto(ean_master)
    if produto:
        from app.database import get_connection
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM dados_logisticos WHERE produto_id = %s", (produto["id"],))
        count = cur.fetchone()[0]
        return {
            "cadastrado": count > 0,
            "descricao": produto['descricao']
        }
    return {"cadastrado": False}

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
