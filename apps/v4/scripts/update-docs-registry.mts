import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DOCS_DIR = path.join(__dirname, "../content/docs/components")

// Base URL for component registry
// This should point to your registry JSON files
// The script will append /{component}.json to this URL
const REGISTRY_BASE_URL = "https://minecraft.ani.ink/r/minecraft"

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

      // 2. Update CLI installation command to use URL-based installation
      // Pattern 1: Match @minecraft-ui/{component} format
      const minecraftUiPattern =
        /```bash\s*npx shadcn@latest add @minecraft-ui\/([^\s]+)\s*```/g
      const minecraftMatches = [...content.matchAll(minecraftUiPattern)]

      for (const match of minecraftMatches) {
        const oldCommand = match[0]
        const componentInCommand = match[1]
        // Remove .json if it's already in the component name
        const cleanComponentName = componentInCommand.replace(/\.json$/, "")
        const newCommand = `\`\`\`bash\nnpx shadcn@latest add ${REGISTRY_BASE_URL}/${cleanComponentName}.json\n\`\`\``
        content = content.replace(oldCommand, newCommand)
        hasChanges = true
      }

      // Pattern 2: Match plain component names (e.g., npx shadcn@latest add button)
      const plainPattern = /```bash\s*npx shadcn@latest add ([^\s@/]+)\s*```/g
      const plainMatches = [...content.matchAll(plainPattern)]

      for (const match of plainMatches) {
        const oldCommand = match[0]
        const componentInCommand = match[1]

        // Skip if it's already a URL
        if (
          !oldCommand.includes("http://") &&
          !oldCommand.includes("https://")
        ) {
          // Remove .json if it's already in the component name
          const cleanComponentName = componentInCommand.replace(/\.json$/, "")
          const newCommand = `\`\`\`bash\nnpx shadcn@latest add ${REGISTRY_BASE_URL}/${cleanComponentName}.json\n\`\`\``
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
