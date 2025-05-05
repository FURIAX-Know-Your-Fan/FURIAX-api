#### **Configuração do Ambiente** ⚙️

Crie um arquivo chamado `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
API_PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:3001

# Configuração do Banco de Dados
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=example
MONGO_URL=mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@FURIAX-db:27017

# JWT
JWT_REGISTER_SECRET=REGISTER_SECRET
JWT_AUTH_SECRET=AUTH_SECRET

# API do Twitter
TWITTER_PYTHON_API_URL=https://localhost:8000

# API da Steam
STEAM_API_KEY=<sua_chave_da_steam>

# Credenciais do Administrador
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin
JWT_AUTH_ADMIN_SECRET=ADMIN_SECRET

# Informações de Login no Twitter
USERNAME=<usuario_do_twitter>
EMAIL=<email_do_twitter>
PASSWORD=<senha_do_twitter>
```

---

#### **Execução dos Módulos de Validação de Documentos** 📜

1. Acesse o diretório de validação de documentos:

```bash
cd document-validation
```

2. Crie um ambiente virtual Python:

```bash
python3 -m venv venv
```

3. Ative o ambiente virtual:

```bash
source venv/bin/activate
```

4. Instale as dependências do projeto:

```bash
pip install -r requirements.txt
```

5. Inicie a API de validação com o seguinte comando:

```bash
uvicorn main:app --host 0.0.0.0 --port 8002
```
