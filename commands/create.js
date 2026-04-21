const fs = require("fs-extra");
const inq = require("inquirer");
const pathResolve = require("path");
const { readBoilerplatesJson } = require("../utils/helper");

const inquirer = inq.default;

async function createCommand(program) {
  const BOILERPLATES_PATH = pathResolve.resolve(__dirname, "../config/boilerplates.json");

  program
    .command("create")
    .option("-b, --boilerplate <name>", "Nombre del boilerplate a usar")
    .option("-n, --name <name>", "Nombre del proyecto")
    .option("-p, --path <path>", "Ruta donde crear el proyecto")
    .option("-j, --json", "Salida en formato JSON")
    .description("Crea un proyecto desde un boilerplate")
    .action(async (options) => {
      let { boilerplate, name, path: targetPath, json } = options;

      const boilerplates = await readBoilerplatesJson();

      if (boilerplates.length === 0) {
        const error = { error: true, message: "No hay boilerplates disponibles. Usa 'ignix add' primero." };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error("❌ No hay boilerplates disponibles.");
          console.log("Usa 'ignix add' para agregar uno.");
        }
        return;
      }

      if (!boilerplate) {
        const answer = await inquirer.prompt([
          {
            type: "list",
            name: "boilerplate",
            message: "Selecciona un boilerplate:",
            choices: boilerplates.map((b) => ({
              name: b.name,
              value: b.name,
            })),
          },
        ]);
        boilerplate = answer.boilerplate;
      }

      const selectedBp = boilerplates.find((b) => b.name === boilerplate);

      if (!selectedBp) {
        const error = { error: true, message: `Boilerplate "${boilerplate}" no encontrado` };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ Boilerplate "${boilerplate}" no encontrado.`);
        }
        return;
      }

      if (!name) {
        const answer = await inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "Nombre del proyecto:",
            default: `my-${boilerplate}-project`,
          },
        ]);
        name = answer.name;
      }

      if (!targetPath) {
        targetPath = pathResolve.resolve(`./${name}`);
      } else {
        targetPath = pathResolve.resolve(targetPath);
      }

      const boilerplatePath = pathResolve.resolve(selectedBp.localPath);

      if (!fs.existsSync(boilerplatePath)) {
        const error = { error: true, message: `El boilerplate "${boilerplate}" no existe en local` };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ El boilerplate "${boilerplate}" no existe en local.`);
        }
        return;
      }

      if (fs.existsSync(targetPath)) {
        const error = { error: true, message: `El directorio "${targetPath}" ya existe` };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ El directorio "${targetPath}" ya existe.`);
        }
        return;
      }

      try {
        if (!json) {
          console.log(`🔄 Copiando boilerplate "${boilerplate}" a ${targetPath}...`);
        }

        await fs.copy(boilerplatePath, targetPath);

        const result = {
          success: true,
          name,
          boilerplate,
          path: targetPath,
        };

        if (json) {
          console.log(JSON.stringify(result));
        } else {
          console.log(`✅ Proyecto "${name}" creado exitosamente.`);
          console.log(`   Ubicación: ${targetPath}`);
        }
      } catch (err) {
        const error = { error: true, message: err.message };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ Error al crear el proyecto: ${err.message}`);
        }
      }
    });
}

module.exports = createCommand;