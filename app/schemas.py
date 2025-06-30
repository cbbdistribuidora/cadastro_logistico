from pydantic import BaseModel
from typing import Optional

class Produto(BaseModel):
    ean_master: str
    descricao: str

class DadoLogistico(BaseModel):
    produto_id: int
    step: int
    ean: Optional[str] = None
    descricao: Optional[str] = None
    embalagem: Optional[str] = None
    unidade_compra: Optional[str] = None
    qtd_embalagem: Optional[int] = None
    altura_cm: Optional[float] = None
    largura_cm: Optional[float] = None
    comprimento_cm: Optional[float] = None
    peso_liquido: Optional[float] = None
    peso_bruto: Optional[float] = None
    tipo_embalagem: Optional[str] = None

class LastroCamada(BaseModel):
    produto_id: int
    lastro: int
    camada: int

class EmbalagemAuxiliar(BaseModel):
    produto_id: int
    step: int
    tipo_embalagem: str
    descricao: str
    ean: Optional[str]
    embalagem: Optional[str]
    unidade_compra: Optional[str]
    qtd_embalagem: Optional[int]
