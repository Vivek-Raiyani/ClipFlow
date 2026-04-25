import { Inngest } from "inngest";
import { executePublishProject } from "@/lib/actions/publish";

// 1. Define the event structure
type Events = {
  "project/publish": {
    data: {
      projectId: string;
      userId: string;
      fileId?: string;
    };
  };
};

// 2. Initialize the client without the generic to avoid the ClientOptions error.
export const inngest = new Inngest({ id: "clipflow" });

/**
 * YouTube Publication Job
 */
export const publishProjectJob = inngest.createFunction(
  {
    id: "publish-project-to-youtube",
    concurrency: 1,
    retries: 2,
    // IMPORTANT: It must be 'trigger' (singular), not 'triggers'
    triggers: { event: "project/publish" }
  },
  // 3. We type the handler arguments directly here for 100% safety
  async ({ event, step }: { event: { data: Events["project/publish"]["data"] }, step: any }) => {
    const { projectId, userId, fileId } = event.data;

    const result = await step.run("execute-publication", async () => {
      return await executePublishProject(projectId, userId, fileId);
    });

    return {
      message: "Publication successful",
      youtubeVideoId: result?.youtubeVideoId
    };
  }
);
