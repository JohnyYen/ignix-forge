const fs = require("fs-extra");
const path = require("path");
const inq = require("inquirer");
const { readBoilerplatesJson, updateBoilerplateInJson, pullTemplate } = require("../utils/helper");

const inquirer = inq.default;

async function updateCommand(program) {
  program
    .command("update")
    .option("-n, --name <name>", "Nombre del boilerplate a actualizar")
    .option("-d, --description <description>", "Nueva descripción")
    .option("-p, --pull", "Hacer git pull para actualizar el boilerplate")
    .option("-j, --json", "Salida en formato JSON")
    .description("Actualiza un boilerplate (git pull o cambia descripción)")
    .action(async (options) => {
      let { name, description, pull, json } = options;

      const boilerplates = await readBoilerplatesJson();

      if (boilerplates.length === 0) {
        const error = { error: true, message: "No hay boilerplates para actualizar" };
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
            message: "Selecciona el boilerplate a actualizar:",
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
        if (pull) {
          if (!json) {
            console.log(`🔄 Actualizando boilerplate "${name}" desde el repositorio...`);
          }
          await pullTemplate(name);
        }

        if (description) {
          await updateBoilerplateInJson(name, null, description);
        }

        const result = {
          success: true,
          name,
          message: pull && description 
            ? "Boilerplate actualizado y descripción cambiada"
            : pull 
              ? "Boilerplate actualizado desde el repositorio"
              : "Descripción actualizada",
        };

        if (json) {
          console.log(JSON.stringify(result));
        } else {
          console.log(`✅ ${result.message}`);
        }
      } catch (err) {
        const error = { error: true, message: err.message };
        if (json) {
          console.log(JSON.stringify(error));
        } else {
          console.error(`❌ Error al actualizar boilerplate: ${err.message}`);
        }
      }
    });
}

module.exports = updateCommand;