const { cloneTemplate, isValidGitUrl, writeBoilerplateInJson } = require("../utils/helper");
const path = require("path");
const fs = require("fs-extra");
const inq = require("inquirer");

const inquirer = inq.default;

function getCommand(program) {
  program
    .command("add")
    .option("-u, --url <url>", "URL del repositorio de git")
    .option("-n, --name <name>", "Nombre del boilerplate")
    .option("-d, --description <description>", "Descripción del boilerplate")
    .option("-j, --json", "Salida en formato JSON")
    .description("Agregar un boilerplate desde un repositorio de git")
    .action(async (options) => {
      let { url, name, description, json } = options;

      if (!name) {
        const answer = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Nombre del boilerplate:",
            default: "my-boilerplate",
          },
        ]);
        name = answer.name;
      }

      if (!url) {
        const answer = await inquirer.prompt([
          {
            type: "input",
            name: "url",
            message: "URL del repositorio de git:",
          },
        ]);
        url = answer.url;
      }

      if (!description) {
        const answer = await inquirer.prompt([
          {
            type: "input",
            name: "description",
            message: "Descripción del boilerplate:",
            default: "...",
          },
        ]);
        description = answer.description;
      }

      const targetDir = path.resolve(`./boilerplates/${name}`);

      if (!isValidGitUrl(url)) {
        const error = { error: true, message: `URL de repositorio inválida: ${url}` };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ ${error.message}`);
        }
        return;
      }

      if (fs.existsSync(targetDir)) {
        const error = { error: true, message: `El boilerplate "${name}" ya existe en ./boilerplates/${name}` };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ ${error.message}`);
        }
        return;
      }

      try {
        await fs.ensureDir(path.dirname(targetDir));

        if (!json) {
          console.log(`🔄 Clonando ${url} a ${targetDir}...`);
        }

        await cloneTemplate(url, name);
        await writeBoilerplateInJson(name, description, url);

        const result = {
          success: true,
          name,
          url,
          localPath: `./boilerplates/${name}`,
        };

        if (json) {
          console.log(JSON.stringify(result));
        } else {
          console.log(`✅ Boilerplate "${name}" agregado exitosamente`);
          console.log(`   Ubicación: ./boilerplates/${name}`);
        }
      } catch (err) {
        const error = { error: true, message: err.message };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ Error al agregar boilerplate: ${err.message}`);
        }
      }
    });
}

module.exports = getCommand;