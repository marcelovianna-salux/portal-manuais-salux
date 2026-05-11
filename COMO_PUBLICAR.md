# 🚀 Como colocar o Portal Salux no ar

## 1. Configurar o Supabase

Acesse https://supabase.com, entre no seu projeto e vá em **SQL Editor**.
Execute os comandos abaixo um por um:

### Criar tabela de perfis
```sql
create table perfis (
  id uuid references auth.users on delete cascade primary key,
  nome text,
  email text,
  role text default 'user',
  created_at timestamp with time zone default now()
);

-- Liberar acesso autenticado
alter table perfis enable row level security;

create policy "Usuário vê próprio perfil"
  on perfis for select
  using (auth.uid() = id);

create policy "Admin vê todos"
  on perfis for select
  using (
    exists (
      select 1 from perfis where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin insere"
  on perfis for insert
  with check (true);

create policy "Admin atualiza"
  on perfis for update
  using (true);

create policy "Admin deleta"
  on perfis for delete
  using (true);
```

### Criar tabela de manuais
```sql
create table manuais (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  modulo text,
  descricao text,
  url text not null,
  icone text,
  created_at timestamp with time zone default now()
);

alter table manuais enable row level security;

create policy "Qualquer autenticado lê manuais"
  on manuais for select
  using (auth.role() = 'authenticated');

create policy "Admin gerencia manuais"
  on manuais for all
  using (
    exists (
      select 1 from perfis where id = auth.uid() and role = 'admin'
    )
  );
```

### Criar o primeiro usuário ADMIN
No Supabase, vá em **Authentication → Users → Add user** e crie o usuário admin.
Depois execute no SQL Editor (substituindo o UUID do usuário criado):

```sql
insert into perfis (id, nome, email, role)
values (
  'UUID_DO_USUARIO_AQUI',
  'Administrador',
  'admin@salux.com.br',
  'admin'
);
```

---

## 2. Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex: `portal-manuais-salux`)
2. Deixe como **público** (necessário para GitHub Pages gratuito)
3. Suba todos os arquivos da pasta `portal_final/` para a raiz do repositório
4. Vá em **Settings → Pages**
5. Em **Source**, selecione `Deploy from a branch`
6. Escolha a branch `main` e pasta `/ (root)`
7. Clique em **Save**

O site ficará disponível em:
`https://SEU_USUARIO.github.io/portal-manuais-salux/login.html`

---

## 3. Acesso

- **URL de acesso:** `https://SEU_USUARIO.github.io/portal-manuais-salux/login.html`
- **Admin:** redireciona para `/admin/index.html`
- **Usuário comum:** redireciona para `/index.html` (portal de manuais)
