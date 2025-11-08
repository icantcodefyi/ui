import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.join(__dirname, "..")

// Directories and files to rename
const RENAMES = [
  {
    from: path.join(ROOT_DIR, "registry/new-york-v4"),
    to: path.join(ROOT_DIR, "registry/minecraft"),
  },
  {
    from: path.join(ROOT_DIR, "public/r/styles/new-york-v4"),
    to: path.join(ROOT_DIR, "public/r/styles/minecraft"),
  },
]

// Files where we need to replace content
const CONTENT_REPLACEMENTS = [
  // Config files
  "components.json",
  "registry.json",
  "registry/__index__.tsx",
  "registry/__blocks__.json",
  "registry/directory.json",
  
  // Script files
  "scripts/build-registry.mts",
  "scripts/capture-registry.mts",
  "scripts/validate-registries.mts",
  "scripts/update-docs-registry.mts",
  
  // Source files
  "lib/registry.ts",
  "lib/blocks.ts",
  "lib/themes.ts",
]

async function renameDirectories() {
  console.log("📁 Renaming directories...")
  
  for (const { from, to } of RENAMES) {
    try {
      const exists = await fs.access(from).then(() => true).catch(() => false)
      if (exists) {
        await fs.rename(from, to)
        console.log(`✅ Renamed: ${path.relative(ROOT_DIR, from)} → ${path.relative(ROOT_DIR, to)}`)
      } else {
        console.log(`⏭️  Skipped (not found): ${path.relative(ROOT_DIR, from)}`)
      }
    } catch (error) {
      console.error(`❌ Error renaming ${from}:`, error)
    }
  }
}

async function replaceInFile(filePath: string, from: string, to: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, "utf-8")
    if (content.includes(from)) {
      const newContent = content.replace(new RegExp(from, "g"), to)
      await fs.writeFile(filePath, newContent, "utf-8")
      return true
    }
    return false
  } catch (error) {
    // File doesn't exist or can't be read
    return false
  }
}

async function updateFileContents() {
  console.log("\n📝 Updating file contents...")
  
  let updatedCount = 0
  let skippedCount = 0
  
  for (const relativePath of CONTENT_REPLACEMENTS) {
    const filePath = path.join(ROOT_DIR, relativePath)
    const updated = await replaceInFile(filePath, "new-york-v4", "minecraft")
    
    if (updated) {
      updatedCount++
      console.log(`✅ Updated: ${relativePath}`)
    } else {
      skippedCount++
      console.log(`⏭️  Skipped: ${relativePath}`)
    }
  }
  
  console.log(`\n   Updated: ${updatedCount} files`)
  console.log(`   Skipped: ${skippedCount} files`)
}

async function updateAllFilesInDirectory(dir: string, extensions: string[]) {
  console.log(`\n🔍 Scanning ${path.relative(ROOT_DIR, dir)} for references...`)
  
  let updatedCount = 0
  
  async function scanDir(currentDir: string) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name)
        
        if (entry.isDirectory()) {
          // Skip node_modules and .git
          if (entry.name !== "node_modules" && entry.name !== ".git" && entry.name !== "dist") {
            await scanDir(fullPath)
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name)
          if (extensions.includes(ext)) {
            const updated = await replaceInFile(fullPath, "new-york-v4", "minecraft")
            if (updated) {
              updatedCount++
              console.log(`✅ Updated: ${path.relative(ROOT_DIR, fullPath)}`)
            }
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
  }
  
  await scanDir(dir)
  console.log(`   Updated: ${updatedCount} files in ${path.relative(ROOT_DIR, dir)}`)
  return updatedCount
}

async function main() {
  console.log("🎮 Starting rename from 'new-york-v4' to 'minecraft'...\n")
  
  try {
    // Step 1: Rename directories
    await renameDirectories()
    
    // Step 2: Update specific config files
    await updateFileContents()
    
    // Step 3: Update all TypeScript/JavaScript files
    await updateAllFilesInDirectory(
      path.join(ROOT_DIR, "app"),
      [".ts", ".tsx", ".js", ".jsx"]
    )
    
    // Step 4: Update all content/docs files
    await updateAllFilesInDirectory(
      path.join(ROOT_DIR, "content"),
      [".mdx", ".md"]
    )
    
    // Step 5: Update components
    await updateAllFilesInDirectory(
      path.join(ROOT_DIR, "components"),
      [".ts", ".tsx"]
    )
    
    // Step 6: Update lib files
    await updateAllFilesInDirectory(
      path.join(ROOT_DIR, "lib"),
      [".ts", ".tsx"]
    )
    
    // Step 7: Update hooks
    await updateAllFilesInDirectory(
      path.join(ROOT_DIR, "hooks"),
      [".ts", ".tsx"]
    )
    
    // Step 8: Update registry files (now in minecraft directory)
    await updateAllFilesInDirectory(
      path.join(ROOT_DIR, "registry/minecraft"),
      [".ts", ".tsx", ".json"]
    )
    
    // Step 9: Update public/r files
    await updateAllFilesInDirectory(
      path.join(ROOT_DIR, "public/r"),
      [".json"]
    )
    
    console.log("\n✨ Rename complete!")
    console.log("\n⚠️  Next steps:")
    console.log("   1. Review the changes with 'git diff'")
    console.log("   2. Test the build: 'pnpm build'")
    console.log("   3. Update any environment variables or deployment configs")
    console.log("   4. Commit the changes")
    
  } catch (error) {
    console.error("\n❌ Error during rename:", error)
    process.exit(1)
  }
}

main()

