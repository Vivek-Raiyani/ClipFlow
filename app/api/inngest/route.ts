import { serve } from "inngest/next";
import { inngest, publishProjectJob } from "@/lib/inngest";

// Export the Inngest API route
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    publishProjectJob,
  ],
});
