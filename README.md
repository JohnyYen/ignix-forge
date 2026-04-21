# ⚡ Ignix CLI – Gestor de Boilerplates desde Git

Ignix es una herramienta de línea de comandos para **gestionar boilerplates desde repositorios Git**. Agregá tus templates favoritos localmente y creá proyectos nuevos en segundos.

## 🧰 Construido con

- **Node.js** + `npm`
- **commander** – Manejo de comandos y opciones
- **inquirer** – Preguntas interactivas
- **fs-extra** – Operaciones con archivos
- **simple-git** – Operaciones Git

## 📦 Instalación local

```bash
# Clonar el repositorio
git clone git@github.com:JohnyYen/Ignis-Forge.git
cd Ignis-Forge

# Instalar dependencias
npm install

# Enlazar globalmente
npm link

# Usar el CLI
ignix --help
```

---

## 🚀 Comandos

### `ignix add`

Agrega un boilerplate desde un repositorio Git.

```bash
ignix add -n <nombre> -u <url-git> -d <descripcion>
```

| Flag | Descripción |
|------|-------------|
| `-n`, `--name` | Nombre del boilerplate |
| `-u`, `--url` | URL del repositorio Git |
| `-d`, `--description` | Descripción |
| `-j`, `--json` | Salida en JSON (para agentes) |

**Ejemplo:**
```bash
ignix add -n react-vite -u git@github.com:user/react-boilerplate.git -d "React con Vite"
```

---

### `ignix list`

Lista los boilerplates disponibles.

```bash
ignix list [--json]
```

**Ejemplo:**
```bash
ignix list
# 📦 BOILERPLATES DISPONIBLES
# ┌────────────────────────────────────────────────────
# │  • react-vite        React con Vite
# └────────────────────────────────────────────────────
```

---

### `ignix create`

Crea un proyecto desde un boilerplate.

```bash
ignix create -b <boilerplate> -n <nombre-proyecto> [-p <ruta>]
```

| Flag | Descripción |
|------|-------------|
| `-b`, `--boilerplate` | Nombre del boilerplate |
| `-n`, `--name` | Nombre del proyecto |
| `-p`, `--path` | Ruta donde crear el proyecto |
| `-j`, `--json` | Salida en JSON |

**Ejemplo:**
```bash
ignix create -b react-vite -n mi-app
```

---

### `ignix update`

Actualiza un boilerplate (git pull) o su descripción.

```bash
ignix update -n <nombre> [--pull] [-d <descripcion>]
```

| Flag | Descripción |
|------|-------------|
| `-n`, `--name` | Nombre del boilerplate |
| `-p`, `--pull` | Ejecutar git pull |
| `-d`, `--description` | Nueva descripción |
| `-j`, `--json` | Salida en JSON |

**Ejemplo:**
```bash
ignix update -n react-vite --pull
```

---

### `ignix remove`

Elimina un boilerplate.

```bash
ignix remove -n <nombre>
```

| Flag | Descripción |
|------|-------------|
| `-n`, `--name` | Nombre del boilerplate |
| `-j`, `--json` | Salida en JSON |

**Ejemplo:**
```bash
ignix remove -n react-vite
```

---

## 🤖 Para Agentes

Todos los comandos soportan `--json` para que agentes como Claude Code, OpenCode, o cualquier bot puedan parsear la salida:

```bash
ignix list --json
# [{"name":"react-vite","repo":"...","localPath":"./boilerplates/react-vite"}]

ignix create -b react-vite -n mi-app --json
# {"success":true,"name":"mi-app","boilerplate":"react-vite","path":"./mi-app"}
```

---

## 📁 Estructura

```
ignix-forge/
├── bin/
│   └── ignix.js              # Entry point
├── commands/
│   ├── add.js                # Add boilerplate
│   ├── list.js               # List boilerplates
│   ├── create.js             # Create project
│   ├── update.js            # Update boilerplate
│   └── remove.js             # Remove boilerplate
├── config/
│   └── boilerplates.json     # Boilerplates registry
├── utils/
│   └── helper.js            # Helper functions
└── package.json
```

### Directorio de trabajo

- **Boilerplates locales**: `./boilerplates/{nombre}`
- **Proyectos creados**: `./{nombre-proyecto}`

---

## 🛠️ Características

- ✅ Agregar boilerplates desde cualquier repo Git
- ✅ Copiar boilerplates a nuevos proyectos
- ✅ Actualizar boilerplates con git pull
- ✅ Interfaz JSON para agentes
- ✅ Soporta SSH y HTTPS

---

## 📌 Contribuir

¿Querés mejorar Ignix? ¡太好了!
- Creá nuevos comandos
- Agregá features
- Reportá errores

---

## 🎉 ¡Listo!

```bash
# Agregá tu primer boilerplate
ignix add -n mi-template -u git@github.com:user/repo.git -d "Mi boilerplate"

# Listá lo que tenés
ignix list

# Creá un proyecto
ignix create -n mi-app -b mi-template
```

¡Arrancá a construir! 🔥