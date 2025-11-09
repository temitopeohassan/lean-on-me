import "dotenv/config";
import app from "./app.js";
import { ensureSupabaseSchema } from "./lib/supabase-schema.js";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function bootstrap() {
  await ensureSupabaseSchema();

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});


