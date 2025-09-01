import { ApiError } from "@/types";
import { ProjectDocument, Project } from "../models/Project";
import dbConnect from "./db";
import Utils from "@/utils/utils";
import { deleteObject } from "./s3";

class ProjectClient {
  static async getProjects(
    clerkId: string
  ): Promise<ProjectDocument[] | ApiError> {
    await dbConnect();
    try {
      const projects = await Project.find({
        user_id: clerkId,
        deleted: false,
      })
        .sort({
          timeCreated: -1,
        })
        .lean<ProjectDocument[]>();
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
      const project = await Project.findById(projectId).lean<ProjectDocument>();
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
  static async deleteProject(projectId: string): Promise<boolean | ApiError> {
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
      if (project.video) {
        await deleteObject(project.video);
      }
      if (project.s3_url) {
        await deleteObject(project.s3_url);
      }
      if (project.song) {
        await deleteObject(project.song);
      }
      project.deleted = true;
      await project.save();
      return true;
    } catch (error: unknown) {
      return Utils.handleApiError(error);
    }
  }
}

export default ProjectClient;
