import { ApiError } from "@/types/ApiError";
import { ProjectDocument, Project } from "../models/Project";
import dbConnect from "./db";

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
    } catch (err: unknown) {
      return this.handleCatch(err);
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
    } catch (err: unknown) {
      return this.handleCatch(err);
    }
  }

  private static handleCatch(err: unknown): ApiError {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error fetching projects from database", message);
    const apiError: ApiError = {
      _error: "Internal Server Error",
      message: "An error occurred while fetching projects from database",
      statusCode: 500,
    };
    return apiError;
  }
}

export default ProjectClient;
