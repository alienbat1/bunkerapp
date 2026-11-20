-- =====================================================================
-- BUNKER — esquema inicial do banco (Cloudflare D1 = SQLite na nuvem)
-- =====================================================================
-- Cada "CREATE TABLE" é uma planilha. Cada coluna tem um tipo:
--   INTEGER = número inteiro   TEXT = texto   REAL = número com vírgula
-- "PRIMARY KEY" = o número de identidade único de cada linha.
-- "REFERENCES" = esta coluna aponta para uma linha de outra tabela.
-- =====================================================================

-- ---------------------------------------------------------------------
-- CATEGORIAS: Projetos, Hábitos, Financeiro, Carreira, Estudo, Hobbies
-- Não existe rota de DELETE para categorias: só "archived" = 1.
-- ---------------------------------------------------------------------
CREATE TABLE categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL UNIQUE,
  position   INTEGER NOT NULL DEFAULT 0,          -- ordem nas abas
  archived   INTEGER NOT NULL DEFAULT 0,          -- 0 = ativa, 1 = arquivada
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Gatilho de segurança: mesmo que alguém tente "DELETE FROM categories",
-- o próprio banco recusa. A regra mora no banco, não só no app.
CREATE TRIGGER categories_no_delete
BEFORE DELETE ON categories
BEGIN
  SELECT RAISE(ABORT, 'Categorias não podem ser deletadas. Arquive.');
END;

-- ---------------------------------------------------------------------
-- PROJETOS: pertencem a uma categoria
-- ---------------------------------------------------------------------
CREATE TABLE projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  title       TEXT    NOT NULL,
  summary     TEXT    NOT NULL DEFAULT '',        -- uma frase: por que esse projeto existe
  position    INTEGER NOT NULL DEFAULT 0,
  archived    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_projects_category ON projects(category_id);

-- ---------------------------------------------------------------------
-- STEPS: o coração do app. Cada step responde três perguntas curtas.
-- O CHECK garante que status só aceita os 4 valores combinados.
-- ---------------------------------------------------------------------
CREATE TABLE steps (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  what        TEXT    NOT NULL,                   -- o que fazer
  place       TEXT    NOT NULL DEFAULT '',        -- onde
  why         TEXT    NOT NULL DEFAULT '',        -- por quê
  status      TEXT    NOT NULL DEFAULT 'andamento'
              CHECK (status IN ('andamento','pausado','bloqueado','concluido')),
  blocked_by  TEXT    NOT NULL DEFAULT '',        -- se bloqueado: o que está travando
  due_date    TEXT,                               -- opcional, formato AAAA-MM-DD
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_steps_project ON steps(project_id);

-- ---------------------------------------------------------------------
-- METAS FINANCEIRAS: opcionalmente vinculadas a um projeto
-- Dinheiro é guardado em CENTAVOS (inteiro). R$ 150,90 = 15090.
-- Por quê? Números com vírgula no computador erram: 0.1 + 0.2 = 0.30000000000000004
-- ---------------------------------------------------------------------
CREATE TABLE budgets (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id   INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  title        TEXT    NOT NULL,
  target_cents INTEGER NOT NULL DEFAULT 0,        -- quanto preciso juntar/gastar
  period       TEXT    NOT NULL DEFAULT 'total'   -- 'total' ou 'mensal'
               CHECK (period IN ('total','mensal')),
  archived     INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Cada movimento do orçamento: positivo = guardei, negativo = gastei
CREATE TABLE budget_entries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  budget_id    INTEGER NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  note         TEXT    NOT NULL DEFAULT '',
  date         TEXT    NOT NULL DEFAULT (date('now')),
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_entries_budget ON budget_entries(budget_id);

-- ---------------------------------------------------------------------
-- NOTIFICAÇÕES PUSH
-- push_subscriptions: o "endereço" do seu iPhone para receber push
-- reminders: lembretes agendados que o Worker dispara
-- ---------------------------------------------------------------------
CREATE TABLE push_subscriptions (
  endpoint   TEXT PRIMARY KEY,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE reminders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  step_id    INTEGER REFERENCES steps(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL DEFAULT '',
  send_at    TEXT NOT NULL,                       -- data/hora UTC: 'AAAA-MM-DD HH:MM:SS'
  sent_at    TEXT,                                -- preenchido quando enviado
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_reminders_pending ON reminders(sent_at, send_at);

-- ---------------------------------------------------------------------
-- DADOS INICIAIS: as seis categorias
-- ---------------------------------------------------------------------
INSERT INTO categories (name, position) VALUES
  ('Projetos',   1),
  ('Hábitos',    2),
  ('Financeiro', 3),
  ('Carreira',   4),
  ('Estudo',     5),
  ('Hobbies',    6);
