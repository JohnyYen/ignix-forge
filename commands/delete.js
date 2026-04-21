const fs = require("fs-extra");
const path = require("path");
const inq = require("inquirer");
const { readBoilerplatesJson, deleteBoilerplateInJson } = require("../utils/helper");

const inquirer = inq.default;

async function deleteCommand(program) {
  const BOILERPLATES_PATH = pathResolve.resolve(__dirname, "../config/boilerplates.json");

  program
    .command("remove")
    .option("-n, --name <name>", "Nombre del boilerplate a eliminar")
    .option("-j, --json", "Salida en formato JSON")
    .description("Eliminar un boilerplate")
    .action(async (options) => {
      let { name, json } = options;

      const boilerplates = await readBoilerplatesJson();

      if (boilerplates.length === 0) {
        const error = { error: true, message: "No hay boilerplates para eliminar" };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error("❌ No hay boilerplates disponibles.");
        }
        return;
      }

      if (!name) {
        const answer = await inquirer.prompt([
          {
            type: "list",
            name: "name",
            message: "Selecciona el boilerplate a eliminar:",
            choices: boilerplates.map((b) => ({
              name: b.name,
              value: b.name,
            })),
          },
        ]);
        name = answer.name;
      }

      const selectedBp = boilerplates.find((b) => b.name === name);

      if (!selectedBp) {
        const error = { error: true, message: `Boilerplate "${name}" no encontrado` };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ Boilerplate "${name}" no encontrado.`);
        }
        return;
      }

      try {
        const bpPath = path.resolve(selectedBp.localPath);

        if (fs.existsSync(bpPath)) {
          if (!json) {
            const confirm = await inquirer.prompt([
              {
                type: "confirm",
                name: "confirm",
                message: `¿Eliminar también la carpeta local ${bpPath}?`,
                default: false,
              },
            ]);
            if (confirm.confirm) {
              await fs.remove(bpPath);
            }
          } else {
            await fs.remove(bpPath);
          }
        }

        await deleteBoilerplateInJson(name);

        const result = {
          success: true,
          name,
          message: `Boilerplate "${name}" eliminado`,
        };

        if (json) {
          console.log(JSON.stringify(result));
        } else {
          console.log(`✅ Boilerplate "${name}" eliminado exitosamente.`);
        }
      } catch (err) {
        const error = { error: true, message: err.message };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ Error al eliminar boilerplate: ${err.message}`);
        }
      }
    });
}

const pathResolve = require("path");
module.exports = deleteCommand;