// Piston Api is a service for code execution like execute code ,Python,Java ,JS and maybe 35 language

import { version } from "react";

const PISTON_API = 'https://emkc.org/api/v2/piston';

const LANGUAGE_VERSION = {
    javascript: { language: "javascript", version: "18.15.0" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
}

export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSION[language];
    if (!languageConfig) {
      return {
        success: false,
        error: `Unsupported Language : ${language}`,
      };
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status ${response.status}`,
      };
    }

    const data = await response.json();
    const run = data.run || {};

    const output = run.output || run.stdout || "";
    const stderr = run.stderr || "";

    if (stderr) {
      return {
        success: false,
        output,
        error: stderr,
      };
    }

    return {
      success: true,
      output: output || "No Output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code : ${error.message}`,
    };
  }
}


function getFileExtension(language) {
    const extensions = {
        javascript: "js",
        python: "py",
        java: "java",
    };

    return extensions[language] || "txt";
}
