from database import get_connection
from schemas import EmbalagemAuxiliar
from database import get_connection

def dictfetchone(cur):
    row = cur.fetchone()
    if row is None:
        return None
    return dict(zip([desc[0] for desc in cur.description], row))

def dictfetchall(cur):
    rows = cur.fetchall()
    if not rows:
        return []
    columns = [desc[0] for desc in cur.description]
    return [dict(zip(columns, row)) for row in rows]

def criar_produto(ean_master, descricao):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM produtos WHERE ean_master = %s", (ean_master,))
    if cur.fetchone():
        return False
    cur.execute("INSERT INTO produtos (ean_master, descricao) VALUES (%s, %s)", (ean_master, descricao))
    conn.commit()
    cur.close()
    conn.close()
    return True

def buscar_produto(ean_master):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM produtos WHERE ean_master = %s", (ean_master,))
    result = dictfetchone(cur)
    cur.close()
    conn.close()
    return result

def buscar_produto_completo(ean_master):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM produtos WHERE ean_master = %s", (ean_master,))
    produto = dictfetchone(cur)

    if not produto:
        cur.close()
        conn.close()
        return {"existe": False}

    cur.execute("SELECT COUNT(*) AS total FROM dados_logisticos WHERE produto_id = %s", (produto["id"],))
    total = cur.fetchone()[0]

    cur.close()
    conn.close()

    return {
        "existe": True,
        "cadastrado": total > 0,
        "id": produto["id"],
        "descricao": produto["descricao"]
    }

def buscar_unidades():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT unidade FROM unidades ORDER BY unidade")
    unidades = dictfetchall(cur)
    cur.close()
    conn.close()
    return unidades

def inserir_dados_logisticos(dados):
    conn = get_connection()
    cur = conn.cursor()
    for d in dados:
        cur.execute("""
            INSERT INTO dados_logisticos 
            (produto_id, step, ean, descricao, embalagem, unidade_compra, qtd_embalagem,
             altura_cm, largura_cm, comprimento_cm, peso_liquido, peso_bruto, tipo_embalagem)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            d.produto_id, d.step, d.ean, d.descricao, d.embalagem, d.unidade_compra,
            d.qtd_embalagem, d.altura_cm, d.largura_cm, d.comprimento_cm,
            d.peso_liquido, d.peso_bruto, d.tipo_embalagem
        ))
    conn.commit()
    cur.close()
    conn.close()

def inserir_lastro_camada(dados):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO lastro_camada (produto_id, lastro, camada)
        VALUES (%s, %s, %s)
    """, (dados.produto_id, dados.lastro, dados.camada))
    conn.commit()
    cur.close()
    conn.close()

def salvar_embalagens_auxiliares(lista: list[EmbalagemAuxiliar]):
    conn = get_connection()
    cur = conn.cursor()
    for emb in lista:
        cur.execute("""
            INSERT INTO embalagens_auxiliares (
                produto_id, step, tipo_embalagem, descricao, ean,
                embalagem, unidade_compra, qtd_embalagem
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            emb.produto_id,
            emb.step,
            emb.tipo_embalagem,
            emb.descricao,
            emb.ean,
            emb.embalagem,
            emb.unidade_compra,
            emb.qtd_embalagem
        ))
    conn.commit()
    cur.close()
    conn.close()

def buscar_dados_logisticos_por_ean(ean):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM dados_logisticos
        WHERE ean = %s
    """, (ean,))
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    resultados = [dict(zip(columns, row)) for row in rows]
    cur.close()
    conn.close()
    return resultados

def buscar_dados_logisticos_vendavel(produto_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM dados_logisticos
        WHERE produto_id = %s AND tipo_embalagem = 'vendavel'
    """, (produto_id,))
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    resultados = [dict(zip(columns, row)) for row in rows]
    cur.close()
    conn.close()
    return resultados

def buscar_embalagem_auxiliar(produto_id, tipo_embalagem):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM embalagens_auxiliares
        WHERE produto_id = %s AND tipo_embalagem = %s
    """, (produto_id, tipo_embalagem))
    row = cur.fetchone()
    columns = [desc[0] for desc in cur.description]
    result = dict(zip(columns, row)) if row else None
    cur.close()
    conn.close()
    return result

def buscar_lastro_camada(produto_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM lastro_camada
        WHERE produto_id = %s
    """, (produto_id,))
    row = cur.fetchone()
    result = dict(zip([desc[0] for desc in cur.description], row)) if row else {}
    cur.close()
    conn.close()
    return result
