const { exec } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

const BOILERPLATES_PATH = path.resolve(__dirname, "../config/boilerplates.json");

async function cloneTemplate(repoUrl, name) {
  const targetDir = path.resolve(`./boilerplates/${name}`);

  try {
    await executeCommand(
      `git clone --depth 1 ${repoUrl} "${targetDir}"`,
      { stdio: "inherit" }
    );
    return true;
  } catch (error) {
    console.error(`❌ Error al clonar template:`);
    console.error(error.message);

    if (fs.existsSync(targetDir)) {
      await fs.remove(targetDir);
    }
    return false;
  }
}

async function pullTemplate(name) {
  const targetDir = path.resolve(`./boilerplates/${name}`);

  try {
    await executeCommand(
      `git -C "${targetDir}" pull`,
      { stdio: "inherit" }
    );
    return true;
  } catch (error) {
    console.error(`❌ Error al actualizar el boilerplate:`);
    console.error(error.message);
    return false;
  }
}

function executeCommand(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

function isValidGitUrl(url) {
  return (
    /^(https?|git):\/\/.+\..+$/.test(url) || /^git@.+:.+\/.+\.git$/.test(url)
  );
}

async function readBoilerplatesJson() {
  try {
    const data = await fs.readFile(BOILERPLATES_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeBoilerplateInJson(name, description, url) {
  const boilerplates = await readBoilerplatesJson();

  const exists = boilerplates.some((b) => b.name === name);
  if (exists) {
    console.log(`❌ El boilerplate "${name}" ya existe.`);
    return false;
  }

  boilerplates.push({
    name,
    description,
    repo: url,
    localPath: `./boilerplates/${name}`,
    createdAt: new Date().toISOString(),
  });

  await fs.writeJson(BOILERPLATES_PATH, boilerplates, { spaces: 2 });
  return true;
}

async function deleteBoilerplateInJson(name) {
  const boilerplates = await readBoilerplatesJson();
  const filtered = boilerplates.filter((b) => b.name !== name);
  await fs.writeJson(BOILERPLATES_PATH, filtered, { spaces: 2 });
  return filtered.length < boilerplates.length;
}

async function updateBoilerplateInJson(name, newUrl, newDescription) {
  const boilerplates = await readBoilerplatesJson();
  const index = boilerplates.findIndex((b) => b.name === name);

  if (index === -1) {
    return false;
  }

  if (newUrl) boilerplates[index].repo = newUrl;
  if (newDescription) boilerplates[index].description = newDescription;

  await fs.writeJson(BOILERPLATES_PATH, boilerplates, { spaces: 2 });
  return true;
}

module.exports = {
  isValidGitUrl,
  pullTemplate,
  cloneTemplate,
  readBoilerplatesJson,
  writeBoilerplateInJson,
  deleteBoilerplateInJson,
  updateBoilerplateInJson,
};