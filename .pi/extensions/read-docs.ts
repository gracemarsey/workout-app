import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

/**
 * Auto-reads project documentation on session start.
 * Reads docs/index.md and injects its content as context.
 */
export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    const docsPath = join(ctx.cwd, "docs", "index.md");
    
    if (existsSync(docsPath)) {
      try {
        const docsContent = readFileSync(docsPath, "utf8");
        // Inject docs as context for the LLM to read
        ctx.ui.notify("Reading project docs...", "info");
        
        // Send a message to the agent with the docs content
        // This gets included in the context for the next prompt
        pi.sendMessage({
          customType: "project-docs",
          content: `# Project Documentation\n\n${docsContent}`,
          display: true,
        }, {
          deliverAs: "steer",
          triggerTurn: false, // Don't trigger a turn, just add context
        });
      } catch (error) {
        console.error("Failed to read docs:", error);
      }
    }
  });
}
