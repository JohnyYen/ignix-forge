const fs = require("fs-extra");
const path = require("path");

const BOILERPLATES_PATH = path.resolve(__dirname, "../config/boilerplates.json");

async function listCommand(program) {
  program
    .command("list")
    .option("-j, --json", "Salida en formato JSON")
    .description("Lista todos los boilerplates disponibles")
    .action(async (options) => {
      const { json } = options;

      let boilerplates = [];
      try {
        const data = await fs.readFile(BOILERPLATES_PATH, "utf8");
        boilerplates = JSON.parse(data);
      } catch (error) {
        boilerplates = [];
      }

      if (json) {
        console.log(JSON.stringify(boilerplates, null, 2));
        return;
      }

      if (boilerplates.length === 0) {
        console.log("\n📦 No hay boilerplates disponibles.\n");
        console.log("Usa 'ignix add' para agregar uno.\n");
        return;
      }

      console.log("\n📦 BOILERPLATES DISPONIBLES\n");
      console.log("┌" + "─".repeat(52));
      for (const bp of boilerplates) {
        const desc = bp.description ? bp.description.substring(0, 30) : "Sin descripción";
        console.log(`│  • ${bp.name.padEnd(20)} ${desc}`);
      }
      console.log("└" + "─".repeat(52) + "\n");

      console.log(`Total: ${boilerplates.length} boilerplate(s)\n`);
    });
}

module.exports = listCommand;