#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import { rmdirSync } from "fs";

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit", shell: true });
    return true;
  } catch (e) {
    console.error(`Failed to execute '${command}'`, e);
    return false;
  }
};

const gitRepoURL = "https://github.com/charana555/mern-backend-starter";
let projectName = process.argv[2];

if (!projectName) {
  console.error("Please provide a project name.");
  process.exit(1);
}

const installDependencies = (projectDir) => {
  const installCommand = `cd ${projectDir} && npm install`;
  return runCommand(installCommand);
};

const main = () => {
  console.log("Backend-Stater-Pack is installing...");

  const gitCheckoutCommand = `git clone --depth 1 ${gitRepoURL} ${projectName}`;
  const checkout = runCommand(gitCheckoutCommand);

  if (!checkout) {
    console.error("Failed to clone the repository. Aborting.");
    process.exit(-1);
  }

  const projectDir = path.join(process.cwd(), projectName);

  console.log("Installing the dependencies...");
  const installDeps = installDependencies(projectDir);

  if (!installDeps) {
    console.error("Failed to install dependencies. Aborting.");
    process.exit(-1);
  }

  console.log(
    "Hurray! Dependencies are installed successfully. Follow the command below to start the project:"
  );
  console.log(`cd ${projectName} && npm start`);

  // Add a listener for the 'exit' event to remove the bin folder
  process.on("exit", () => {
    const binFolderPath = path.join(projectDir, "bin");
    const gitFolderPath = path.join(projectDir, ".git");
    try {
      rmdirSync(binFolderPath, { recursive: true });
      rmdirSync(gitFolderPath, { recursive: true });
    } catch (e) {
      console.error("Failed to remove the bin folder.", e);
    }
  });
};

main();
