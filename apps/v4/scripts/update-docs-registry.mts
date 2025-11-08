import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DOCS_DIR = path.join(__dirname, "../content/docs/components")

async function updateComponentDocs() {
  try {
    const files = await fs.readdir(DOCS_DIR)
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"))

    let updatedCount = 0
    let skippedCount = 0

    for (const file of mdxFiles) {
      const filePath = path.join(DOCS_DIR, file)
      let content = await fs.readFile(filePath, "utf-8")

      // Get component name from filename (e.g., alert.mdx -> alert)
      const componentName = file.replace(".mdx", "")

      let hasChanges = false

      // 1. Remove any existing Minecraft UI callouts
      const calloutPattern =
        /<Callout[^>]*>\s*\*\*Using Minecraft UI\?\*\*[\s\S]*?<\/Callout>/g
      if (calloutPattern.test(content)) {
        content = content.replace(calloutPattern, "")
        hasChanges = true
      }

      // 2. Update CLI installation command to use @minecraft-ui/{component}
      const oldCliPattern = /```bash\s*npx shadcn@latest add ([^\s@]+)\s*```/g
      const matches = [...content.matchAll(oldCliPattern)]

      for (const match of matches) {
        const oldCommand = match[0]
        const componentInCommand = match[1]

        // Only update if it's not already using @minecraft-ui
        if (!oldCommand.includes("@minecraft-ui")) {
          const newCommand = `\`\`\`bash\nnpx shadcn@latest add @minecraft-ui/${componentInCommand}\n\`\`\``
          content = content.replace(oldCommand, newCommand)
          hasChanges = true
        }
      }

      if (hasChanges) {
        await fs.writeFile(filePath, content, "utf-8")
        updatedCount++
        console.log(`✅ Updated: ${file}`)
      } else {
        skippedCount++
        console.log(`⏭️  Skipped (no changes needed): ${file}`)
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   Updated: ${updatedCount} files`)
    console.log(`   Skipped: ${skippedCount} files`)
    console.log(`   Total: ${mdxFiles.length} files`)
  } catch (error) {
    console.error("❌ Error updating docs:", error)
    process.exit(1)
  }
}

updateComponentDocs()
