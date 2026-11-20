-- Projeto de exemplo para ver o app funcionando. Apague quando quiser.
INSERT INTO projects (category_id, title, summary)
VALUES ((SELECT id FROM categories WHERE name = 'Hobbies'), 'Aulas de teatro',
        'Voltar a ter um lugar onde eu crio com outras pessoas, toda semana.');

INSERT INTO steps (project_id, what, place, why, status, position, blocked_by) VALUES
 (last_insert_rowid(), 'Listar 3 escolas perto de casa', 'Google Maps, raio de 5 km',
  'Sem lista eu fico só pensando e não decido.', 'concluido', 1, ''),
 ((SELECT MAX(id) FROM projects), 'Pedir horários e preços por e-mail', 'E-mail das 3 escolas',
  'Comparar com números, não com impressão.', 'bloqueado', 2, 'Esperando resposta de 2 escolas'),
 ((SELECT MAX(id) FROM projects), 'Fazer aula experimental', 'A escola mais barata das 3',
  'Ver se o grupo me deixa à vontade antes de pagar.', 'andamento', 3, ''),
 ((SELECT MAX(id) FROM projects), 'Separar roupa confortável para aula', 'Gaveta de baixo',
  'Tirar uma desculpa do caminho.', 'pausado', 4, '');

INSERT INTO budgets (project_id, title, target_cents, period)
VALUES ((SELECT MAX(id) FROM projects), 'Mensalidade + matrícula', 60000, 'total');

INSERT INTO budget_entries (budget_id, amount_cents, note) VALUES
 (last_insert_rowid(), 15000, 'Guardei do freela'),
 ((SELECT MAX(id) FROM budgets), 10000, 'Sobra do mês');
