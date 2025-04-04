import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const getDirectories = async () => {
  const dirents = await readdir(".", { withFileTypes: true });
  return dirents
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "node_modules")
    .map((dirent) => dirent.name);
};

const processDirectory = async (dir) => {
  const metadataPath = join(dir, "metadata.json");

  try {
    const data = await readFile(metadataPath, "utf8");
    const metadata = JSON.parse(data);

    if (metadata.status === "doing") {
      return {
        source: `/${dir}/*.${metadata.format}`,
        translation: "/%original_path%/%locale%/%original_file_name%",
      };
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      // 忽略文件不存在的错误
      console.error(`处理 ${metadataPath} 失败:`, error.message);
    }
  }
  return null;
};

const main = async () => {
  const directories = await getDirectories();
  const entries = [];

  // 使用 for...of 替代 forEach
  for (const dir of directories) {
    const entry = await processDirectory(dir);
    if (entry) entries.push(entry);
  }

  const yamlContent = [
    "files:",
    ...entries.map(
      (entry) =>
        `  - source: "${entry.source}"\n    translation: "${entry.translation}"`
    ),
  ].join("\n");

  await writeFile("crowdin.yml", yamlContent);
  console.log("✅ crowdin.yml 生成完成");
};

main().catch(console.error);
