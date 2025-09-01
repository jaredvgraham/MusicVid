"use client";

import React, { useState } from "react";
import {
  Search,
  User,
  FolderOpen,
  Calendar,
  Play,
  AlertCircle,
  Copy,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ProjectDocument } from "@/backend/models/Project";

interface UserProjects {
  userId: string;
  projects: ProjectDocument[];
  totalProjects: number;
  activeProjects: number;
  failedProjects: number;
  projectsWithFinalRenders: number;
  projectsWithVideos: number;
  projectsWithLyrics: number;
}

const AdminDashboard = () => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProjects, setUserProjects] = useState<UserProjects | null>(null);
  const { user } = useUser();
  const router = useRouter();

  if (
    user?.primaryEmailAddress?.emailAddress !==
    process.env.NEXT_PUBLIC_ADMIN_EMAIL
  ) {
    router.push("/");
    return null;
  }

  const searchUser = async () => {
    if (!userId.trim()) {
      setError("Please enter a user ID");
      return;
    }

    setLoading(true);
    setError(null);
    setUserProjects(null);

    try {
      console.log("Searching for user:", userId.trim());
      const response = await fetch(
        `/api/admin/user-projects?userId=${encodeURIComponent(userId.trim())}`
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log("Error response:", data);
        throw new Error(
          data?.error?.message || `Request failed: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Success response:", data);
      setUserProjects(data);
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || "Failed to fetch user projects");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateInput: string | Date | undefined) => {
    if (!dateInput) return "Unknown date";

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProjectStatus = (project: ProjectDocument) => {
    if (project.failed)
      return {
        status: "Failed",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
      };

    if (project.finalRender)
      return {
        status: "Completed",
        color: "text-green-400",
        bgColor: "bg-green-500/20",
      };
    return {
      status: "Active",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    };
  };

  const copyProjectId = async (projectId: string) => {
    try {
      await navigator.clipboard.writeText(projectId);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy project ID:", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-neutral-300">
            Search for users and view their projects
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-neutral-200 mb-2"
              >
                User ID (Clerk ID)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter Clerk User ID (e.g., user_2abc123def456)"
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-neutral-400"
                  onKeyPress={(e) => e.key === "Enter" && searchUser()}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={searchUser}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:from-purple-400 disabled:to-fuchsia-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-2xl shadow-purple-500/25"
              >
                <Search className="h-4 w-4" />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-200">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* User Projects Display */}
        {userProjects && (
          <div className="space-y-6">
            {/* User Summary */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                User: {userProjects.userId}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                      {userProjects.totalProjects}
                    </div>
                  </div>
                  <div className="text-neutral-300 font-semibold text-sm">
                    Total Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {userProjects.activeProjects}
                    </div>
                  </div>
                  <div className="text-neutral-300 font-semibold text-sm">
                    Active
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                    <div className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                      {userProjects.failedProjects}
                    </div>
                  </div>
                  <div className="text-neutral-300 font-semibold text-sm">
                    Failed
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                      {userProjects.projectsWithFinalRenders}
                    </div>
                  </div>
                  <div className="text-neutral-300 font-semibold text-sm">
                    With Final Renders
                  </div>
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-3xl">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-medium text-white">Projects</h3>
              </div>
              <div className="divide-y divide-white/10">
                {userProjects.projects.map((project) => {
                  const status = getProjectStatus(project);
                  return (
                    <div
                      key={project._id.toString()}
                      className="p-6 hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-medium text-white">
                              {project.name ||
                                project.song ||
                                "Untitled Project"}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}
                            >
                              {status.status}
                            </span>
                            <button
                              onClick={() =>
                                copyProjectId(project._id.toString())
                              }
                              className="text-neutral-400 hover:text-neutral-200 transition-colors p-1 rounded hover:bg-neutral-800/50"
                              title="Copy Project ID"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-300">
                            {project.song && (
                              <div className="flex items-center gap-2">
                                <Play className="h-4 w-4" />
                                <span>{project.song}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatDate(
                                  project.time_created || project.createdAt
                                )}
                              </span>
                            </div>
                            {project.length &&
                              typeof project.length === "number" && (
                                <div className="flex items-center gap-2">
                                  <FolderOpen className="h-4 w-4" />
                                  <span>{project.length}s</span>
                                </div>
                              )}
                          </div>

                          {/* Additional Project Details */}
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-neutral-400">
                            {project.width && project.height && (
                              <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                                <div className="font-medium">
                                  {project.width}×{project.height}
                                </div>
                                <div className="text-neutral-500">
                                  Resolution
                                </div>
                              </div>
                            )}
                            {project.orientation && (
                              <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                                <div className="font-medium capitalize">
                                  {project.orientation}
                                </div>
                                <div className="text-neutral-500">
                                  Orientation
                                </div>
                              </div>
                            )}
                            {project.transcript &&
                              project.transcript.length > 0 && (
                                <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                                  <div className="font-medium">
                                    {project.transcript.length}
                                  </div>
                                  <div className="text-neutral-500">
                                    Transcript Lines
                                  </div>
                                </div>
                              )}
                            {project.textClips &&
                              project.textClips.length > 0 && (
                                <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                                  <div className="font-medium">
                                    {project.textClips.length}
                                  </div>
                                  <div className="text-neutral-500">
                                    Text Clips
                                  </div>
                                </div>
                              )}
                          </div>

                          <div className="mt-3 flex gap-3">
                            <a
                              href={`/workspace/${project._id}`}
                              className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/25"
                            >
                              <FolderOpen className="h-4 w-4" />
                              View in Workspace
                            </a>
                            {project.video && (
                              <a
                                href={project.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 text-sm inline-flex items-center gap-1 transition-colors border border-purple-400/30 px-3 py-2 rounded-lg hover:bg-purple-400/10"
                              >
                                <Play className="h-4 w-4" />
                                View Video
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
