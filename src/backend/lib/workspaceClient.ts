import { UpdateTranscriptResult } from "@/types";
import dbConnect from "./db";
import Utils from "@/utils/utils";
import Project, { ProjectDocument, Line } from "../models/Project";

class WorkspaceClient {
  static async updateTranscript(
    clerkId: string,
    projectId: string,
    transcript: Line[]
  ): Promise<UpdateTranscriptResult> {
    await dbConnect();
    try {
      await dbConnect();

      const project: ProjectDocument | null = await Project.findById(projectId);
      if (!project) {
        console.error(`project not found for ID: ${projectId}`);
        return {
          ok: false,
          error: Utils.buildApiError(
            "Project not found",
            `project not found for ID: ${projectId}`,
            404
          ),
        };
      }
      if (project.user_id !== clerkId) {
        const message = "Unauthorized to edit project";
        return {
          ok: false,
          error: Utils.buildApiError(message, message, 401),
        };
      }
      project.transcript = transcript;
      await project.save();
      return { ok: true, data: project.transcript };
    } catch (error) {
      return {
        ok: false,
        error: Utils.handleApiError(error),
      };
    }
  }

  /**
   * TODO:
   * - Add additional methods for updating various workspace edits
   */
}

export default WorkspaceClient;
