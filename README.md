```markdown
# Gerenciador de Serviços Protéticos - API

Dental prosthetic service management API. CRUD operations for clients, locations, products,
and service orders with JWT authentication and Excel export.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require JWT token (except register/login).

**Include token in header:**
```
Authorization: Bearer your_jwt_token_here
## Endpoints

### Auth & Users

| Method | Endpoint | Auth | Success Response | Error Response |
|--------|----------|------|------------------|----------------|
| POST | `/user/register` | No | `200 "User register completed"` | `400 validation error` |
| POST | `/user/login` | No | `200 { token, user: true }` | `400 "Invalid credentials"` |
| GET | `/user/` | Yes | `200 [users]` | `404 "Nenhum Usuario encontrado"` or `400` |
| GET | `/user/validate` | Yes | `200 { valid: true, user }` | `400` |
| PUT | `/user/edit/:id` | Yes | `200 "User atualizado"` | `400 validation error` |

### Clientes

| Method | Endpoint | Success Response | Error Response |
|--------|----------|------------------|----------------|
| GET | `/cliente/todos` | `200 { all: [...] }` | `404 "Nenhum Cliente encontrado"` |
| GET | `/cliente/:id` | `200 { cliente, serviços }` | `404 "Cliente não encontrado"` |
| POST | `/cliente/novo` | `200 "Cliente salvo"` | `400 validation error` |
| PUT | `/cliente/:id/edit` | `200 "Cliente modificado"` | `400 validation error` |
| DELETE | `/cliente/:id` | `200 "Cliente deletado"` | `409 with related services message` |

### Locais

| Method | Endpoint | Success Response | Error Response |
|--------|----------|------------------|----------------|
| GET | `/local/todos` | `200 { all: [...] }` | `404 "Nenhum Local encontrado"` |
| GET | `/local/:id` | `200 { local, clientes }` | `404 "Local não encontrado"` |
| POST | `/local/novo` | `200 "Local salvo"` | `400 validation error` |
| PUT | `/local/:id/edit` | `200 "Local atualizado"` | `400 validation error` |
| DELETE | `/local/:id` | `200 "Local deletado"` | `409 with related clients message` |

### Produtos

| Method | Endpoint | Success Response | Error Response |
|--------|----------|------------------|----------------|
| GET | `/produto/todos` | `200 { all: [...] }` | `404 "Nenhum Produto foi encontrado"` |
| GET | `/produto/:id` | `200 { produto, serviço }` | `404 "Produto não foi encontrado"` |
| POST | `/produto/novo` | `200 "Produto salvo"` | `400 "Produto já registrado"` or `400 validation error` |
| PUT | `/produto/:id/edit` | `200 "Produto atualizado"` | `400 validation error` |
| DELETE | `/produto/:id` | `200 "Produto deletado"` | `409 with related services message` |

### Serviços

| Method | Endpoint | Success Response | Error Response |
|--------|----------|------------------|----------------|
| GET | `/servico/todos` | `200 { all: [...] }` | `404 "Nenhum Serviço foi encontrado"` |
| GET | `/servico/:id` | `200 { serviço }` | `404 "Serviço não foi encontrado"` |
| GET | `/servico/todos/local/:id` | `200 { all: [...] }` | `404 "Nenhum Serviço foi encontrado"` |
| GET | `/servico/todos/cliente/:id` | `200 { all: [...] }` | `404 "Nenhum Serviço foi encontrado"` |
| POST | `/servico/novo` | `200 "Serviço Salvo"` | `400 validation error` |
| PUT | `/servico/:id/edit` | `200 "Serviço Atualizado"` | `400 validation error` |
| DELETE | `/servico/:id` | `200 "Serviço deletado"` | `400 validation error` |

### Export

| Method | Endpoint | Auth | Query Parameters | Success Response | Error Response |
|--------|----------|------|------------------|------------------|----------------|
| GET | `/exportar` | Yes | `cliente`, `local`, `startDate`, `endDate` | Excel file (.xlsx) | `404 "Nenhum serviço encontrado"` or `500 server error` |

**Export Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cliente` | string | Yes | Client ID |
| `local` | string | Yes | Location ID |
| `startDate` | date | Yes | Start date for filtering services |
| `endDate` | date | Yes | End date for filtering services |

## Setup

```bash
npm install
```

Create `.env` file:
```
MONGODB_URI=your_mongodb_connection
PORT=3000
JWT_SECRET=your_secret_key
```

Run:
```bash
npm start
```
## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (passport-jwt)
- bcrypt (password hashing)
- ExcelJS (Excel file generation)
