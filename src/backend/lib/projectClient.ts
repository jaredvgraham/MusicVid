import { ApiError } from "@/types";
import { ProjectDocument, Project } from "../models/Project";
import dbConnect from "./db";
import Utils from "@/utils/utils";

class ProjectClient {
  static async getProjects(
    clerkId: string
  ): Promise<ProjectDocument[] | ApiError> {
    await dbConnect();
    try {
      const projects = await Project.find({ user_id: clerkId }).sort({
        timeCreated: -1,
      });
      console.log(JSON.stringify(projects, null, 2));
      return projects;
    } catch (err) {
      return Utils.handleApiError(err);
    }
  }

  static async getProject(
    projectId: string
  ): Promise<ProjectDocument | ApiError> {
    await dbConnect();
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        const error: ApiError = {
          _error: "Project not found",
          message: "Project not found",
          statusCode: 404,
        };
        return error;
      }
      return project;
    } catch (err) {
      return Utils.handleApiError(err);
    }
  }
}

export default ProjectClient;
