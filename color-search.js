import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function findColorUsages(dir) {
  const colorRegexes = [
    /#([0-9a-fA-F]{3}){1,2}\b/g, // Hex codes
    /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, // rgb()
    /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/g, // rgba()
    /\b(red|green|blue|yellow|purple|orange|pink|teal|cyan|lime|amber|fuchsia|violet|indigo|gray|white|black)\b/g, // Color names
  ];

  let totalFilesSearched = 0;
  let totalColorUsagesFound = 0;

  // Construct the absolute path to the 'src' directory
  const srcPath = path.resolve(__dirname, dir);

  async function walk(currentDir) {
    try {
      const files = await fs.readdir(currentDir);
      const promises = files.map(async (file) => {
        const filePath = path.join(currentDir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
          await walk(filePath);
        } else if (
          filePath.startsWith(srcPath) &&
          /\.(js|jsx|ts|tsx|css)$/.test(filePath)
        ) {
          totalFilesSearched++;
          try {
            const content = await fs.readFile(filePath, "utf8");
            let fileColorUsages = 0;
            colorRegexes.forEach((regex) => {
              let match;
              while ((match = regex.exec(content)) !== null) {
                const lineNumber =
                  (content.substring(0, match.index).match(/\n/g) || [])
                    .length + 1;
                console.log(`${filePath}:${lineNumber}: ${match[0]}`);
                totalColorUsagesFound++;
                fileColorUsages++;
              }
            });
            if (fileColorUsages > 0) {
              console.log(
                `\nFound ${fileColorUsages} color usages in ${filePath}\n`
              ); // Separator
            }
          } catch (error) {
            console.error(`Error reading file ${filePath}: ${error}`);
          }
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(`Error reading directory ${currentDir}: ${error}`);
    }
  }

  // Convert dir to absolute path before calling walk
  const absoluteDirPath = path.resolve(__dirname, dir);
  await walk(absoluteDirPath);

  console.log("\n--- Summary ---");
  console.log(`Total files searched: ${totalFilesSearched}`);
  console.log(`Total color usages found: ${totalColorUsagesFound}`);
}

findColorUsages("./src");
