const fs = require("fs-extra");
const path = require("path");

function initCLI(program) {
  program.name("ignix").description("CLI para gestionar boilerplates desde repositorios Git");

  program.action(() => {
    const asciiArt = `
  ██╗ ██████╗ ███╗   ██╗██╗███████╗     ██████╗██╗     ██╗
 ███║██╔════╝ ████╗  ██║██║██╔════╝    ██╔════╝██║     ██║
 ╚██║██║  ███╗██╔██╗ ██║██║███████╗    ██║     ██║     ██║
  ██║██║   ██║██║╚██╗██║██║╚════██║    ██║     ██║     ██║
  ██║╚██████╔╝██║ ╚████║██║███████║    ╚██████╗███████╗██║
  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚══════╝     ╚═════╝╚══════╝╚═╝

Bienvenido a Ignix CLI ⚡
Versión: ${process.env.npm_package_version || "1.0.0"}
`;

    console.log(asciiArt);
    console.log("Comandos disponibles:");
    console.log("  ignix add        - Agregar un boilerplate desde Git");
    console.log("  ignix list      - Listar boilerplates disponibles");
    console.log("  ignix create    - Crear proyecto desde un boilerplate");
    console.log("  ignix update    - Actualizar un boilerplate (git pull)");
    console.log("  ignix remove    - Eliminar un boilerplate");
    console.log("");
    console.log("Usa 'ignix <comando> --help' para más información.\n");
  });
}

module.exports = initCLI;