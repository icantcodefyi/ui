import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DOCS_DIR = path.join(__dirname, "../content/docs/components")

const MINECRAFT_UI_NOTE = `
<Callout className="mt-4">
  **Using Minecraft UI?** This component is available with Minecraft styling at [minecraft.ani.ink](https://minecraft.ani.ink). Install it with:
  
  \`\`\`bash
  npx shadcn@latest add @minecraft-ui/{COMPONENT_NAME}
  \`\`\`
</Callout>
`

async function updateComponentDocs() {
  try {
    const files = await fs.readdir(DOCS_DIR)
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"))

    let updatedCount = 0
    let skippedCount = 0

    for (const file of mdxFiles) {
      const filePath = path.join(DOCS_DIR, file)
      let content = await fs.readFile(filePath, "utf-8")

      // Skip if already has Minecraft UI note
      if (content.includes("Using Minecraft UI?")) {
        skippedCount++
        continue
      }

      // Get component name from filename (e.g., alert.mdx -> alert)
      const componentName = file.replace(".mdx", "")

      // Find the CLI installation section and add note after it
      const cliPattern = /```bash\s*npx shadcn@latest add [^\s]+\s*```/

      if (cliPattern.test(content)) {
        // Replace {COMPONENT_NAME} with actual component name
        const note = MINECRAFT_UI_NOTE.replace("{COMPONENT_NAME}", componentName)

        // Add the note after the CLI installation command
        content = content.replace(
          cliPattern,
          (match) => match + "\n" + note
        )

        await fs.writeFile(filePath, content, "utf-8")
        updatedCount++
        console.log(`✅ Updated: ${file}`)
      } else {
        skippedCount++
        console.log(`⏭️  Skipped (no CLI section): ${file}`)
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

