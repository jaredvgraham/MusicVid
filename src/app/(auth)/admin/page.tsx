"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  FolderOpen,
  Calendar,
  Play,
  AlertCircle,
  Copy,
  RefreshCw,
  Eye,
  Download,
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProjectDocument } from "@/backend/models/Project";
import { EMAIL_TEMPLATES, EmailTemplate } from "@/lib/emailTemplates";

interface UserInfo {
  clerkId: string;
  name?: string;
  email: string;
  image?: string;
  plan?: string;
}

interface FinalRender {
  _id: string;
  renderUrl: string;
  renderKey: string;
  createdAt: string;
}

interface RecentProject {
  _id: string;
  name: string;
  song?: string;
  lyrics?: string;
  time_created: string;
  createdAt: string;
  updatedAt: string;
  failed: boolean;
  length: number;
  width?: number;
  height?: number;
  orientation?: string;
  video: string;
  videoKey?: string;
  transcript?: any[];
  textClips?: any[];
  lyricPresetId?: string;
  layoutPresetId?: string;
  transcriptRefreshes?: number;
  user: UserInfo | null;
  finalRenders: FinalRender[];
}

interface RecentProjectsResponse {
  projects: RecentProject[];
  total: number;
  timestamp: number;
}

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

interface InactiveUser {
  clerkId: string;
  email: string;
  name?: string;
  plan: string;
  createdAt: string;
  daysSinceSignup: number;
}

interface InactiveUsersResponse {
  success: boolean;
  inactiveUsers: InactiveUser[];
  totalUsers: number;
  usersWithProjects: number;
  inactiveCount: number;
}

interface BulkEmailResponse {
  success: boolean;
  message: string;
  results: {
    total: number;
    successful: number;
    failed: number;
    successfulEmails: string[];
    failedEmails: Array<{ email: string; error: string }>;
  };
}

interface UserWithStats {
  clerkId: string;
  email: string;
  name?: string;
  plan: string;
  createdAt: string;
  projects: Array<{
    _id: string;
    name: string;
    time_created: string;
    failed: boolean;
    hasVideo: boolean;
    hasLyrics: boolean;
    hasFinalRender: boolean;
    finalRenderUrl?: string;
  }>;
  totalProjects: number;
  activeProjects: number;
  failedProjects: number;
  projectsWithFinalRenders: number;
  totalFinalRenders: number;
}

interface AllUsersResponse {
  success: boolean;
  users: UserWithStats[];
  statistics: {
    totalUsers: number;
    usersWithProjects: number;
    usersWithoutProjects: number;
    totalProjects: number;
    totalFinalRenders: number;
    averageProjectsPerUser: string;
    averageFinalRendersPerUser: string;
  };
}

const AdminDashboard = () => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProjects, setUserProjects] = useState<UserProjects | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentProjectsLoading, setRecentProjectsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "recent" | "search" | "email" | "users"
  >("recent");

  // Email functionality state
  const [inactiveUsers, setInactiveUsers] = useState<InactiveUser[]>([]);
  const [inactiveUsersLoading, setInactiveUsersLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [sendingEmails, setSendingEmails] = useState(false);
  const [emailResults, setEmailResults] = useState<
    BulkEmailResponse["results"] | null
  >(null);

  // All users functionality state
  const [allUsers, setAllUsers] = useState<UserWithStats[]>([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [usersStatistics, setUsersStatistics] = useState<
    AllUsersResponse["statistics"] | null
  >(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  // Fetch recent projects on component mount
  useEffect(() => {
    if (
      user?.primaryEmailAddress?.emailAddress ===
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      fetchRecentProjects();
    }
  }, [user]);

  if (
    user?.primaryEmailAddress?.emailAddress !==
    process.env.NEXT_PUBLIC_ADMIN_EMAIL
  ) {
    router.push("/");
    return null;
  }

  const fetchRecentProjects = async () => {
    setRecentProjectsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/recent-projects");

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error?.message || `Request failed: ${response.status}`
        );
      }

      const data: RecentProjectsResponse = await response.json();
      setRecentProjects(data.projects);
    } catch (err: any) {
      console.error("Error fetching recent projects:", err);
      setError(err.message || "Failed to fetch recent projects");
    } finally {
      setRecentProjectsLoading(false);
    }
  };

  const fetchInactiveUsers = async () => {
    setInactiveUsersLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/inactive-users");

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error?.message || `Request failed: ${response.status}`
        );
      }

      const data: InactiveUsersResponse = await response.json();
      setInactiveUsers(data.inactiveUsers);
    } catch (err: any) {
      console.error("Error fetching inactive users:", err);
      setError(err.message || "Failed to fetch inactive users");
    } finally {
      setInactiveUsersLoading(false);
    }
  };

  const sendBulkEmails = async () => {
    if (selectedEmails.length === 0) {
      setError("Please select at least one email address");
      return;
    }

    if (!selectedTemplate && (!emailSubject.trim() || !emailMessage.trim())) {
      setError("Please select a template or provide both subject and message");
      return;
    }

    setSendingEmails(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/send-bulk-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: selectedEmails,
          subject: emailSubject,
          message: emailMessage,
          templateId: selectedTemplate || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error?.message || `Request failed: ${response.status}`
        );
      }

      const data: BulkEmailResponse = await response.json();
      setEmailResults(data.results);
    } catch (err: any) {
      console.error("Error sending bulk emails:", err);
      setError(err.message || "Failed to send bulk emails");
    } finally {
      setSendingEmails(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId && templateId !== "custom") {
      const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setEmailSubject(template.subject);
        setEmailMessage(template.message);
      }
    } else if (templateId === "custom") {
      setEmailSubject("");
      setEmailMessage("");
    }
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === inactiveUsers.length) {
      // If all are selected, deselect all
      setSelectedEmails([]);
    } else {
      // Select all inactive users
      setSelectedEmails(inactiveUsers.map((user) => user.email));
    }
  };

  const fetchAllUsers = async () => {
    setAllUsersLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/all-users");

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error?.message || `Request failed: ${response.status}`
        );
      }

      const data: AllUsersResponse = await response.json();
      setAllUsers(data.users);
      setUsersStatistics(data.statistics);
    } catch (err: any) {
      console.error("Error fetching all users:", err);
      setError(err.message || "Failed to fetch all users");
    } finally {
      setAllUsersLoading(false);
    }
  };

  const searchUser = async (clerkId?: string) => {
    const userIdToSearch = clerkId || userId.trim();

    if (!userIdToSearch) {
      setError("Please enter a user ID");
      return;
    }

    setLoading(true);
    setError(null);
    setUserProjects(null);

    try {
      console.log("Searching for user:", userIdToSearch);
      const response = await fetch(
        `/api/admin/user-projects?userId=${encodeURIComponent(userIdToSearch)}`
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

  const handleUserClick = async (clerkId: string) => {
    setActiveTab("search");
    setUserId(clerkId);
    await searchUser(clerkId);
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

  // Recent Project Card Component
  const RecentProjectCard = ({ project }: { project: RecentProject }) => {
    const getProjectStatus = () => {
      if (project.failed)
        return {
          status: "Failed",
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          icon: XCircle,
        };

      if (project.finalRenders.length > 0)
        return {
          status: "Completed",
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          icon: CheckCircle,
        };

      return {
        status: "Active",
        color: "text-purple-400",
        bgColor: "bg-purple-500/20",
        icon: Clock,
      };
    };

    const status = getProjectStatus();
    const StatusIcon = status.icon;

    return (
      <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 hover:bg-neutral-800/50 transition-all duration-300 group">
        {/* Project Header */}
        <div
          className="flex items-start justify-between mb-4 cursor-pointer"
          onClick={() => handleUserClick(project.user!.clerkId)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                {project.name || project.song || "Untitled Project"}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color} flex items-center gap-1`}
              >
                <StatusIcon className="h-3 w-3" />
                {status.status}
              </span>
            </div>

            {/* User Info */}
            {project.user && (
              <div className="flex items-center gap-3 mb-3">
                {project.user.image ? (
                  <Image
                    src={project.user.image}
                    alt={project.user.name || project.user.email}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                <div>
                  <button
                    onClick={() => handleUserClick(project.user!.clerkId)}
                    className="text-sm font-medium text-white hover:text-purple-300 transition-colors text-left hover:underline"
                  >
                    {project.user.name || "Unknown User"}
                  </button>
                  <p className="text-xs text-neutral-400">
                    {project.user.email} • {project.user.plan || "Free"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => copyProjectId(project._id)}
            className="text-neutral-400 hover:text-neutral-200 transition-colors p-1 rounded hover:bg-neutral-800/50"
            title="Copy Project ID"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-neutral-300">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(project.time_created)}</span>
          </div>
          {project.length && (
            <div className="flex items-center gap-2 text-neutral-300">
              <Clock className="h-4 w-4" />
              <span>{project.length}s</span>
            </div>
          )}
          {project.width && project.height && (
            <div className="flex items-center gap-2 text-neutral-300">
              <FolderOpen className="h-4 w-4" />
              <span>
                {project.width}×{project.height}
              </span>
            </div>
          )}
          {project.orientation && (
            <div className="flex items-center gap-2 text-neutral-300">
              <ExternalLink className="h-4 w-4" />
              <span className="capitalize">{project.orientation}</span>
            </div>
          )}
        </div>

        {/* Final Renders */}
        {project.finalRenders.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-neutral-200 mb-2 flex items-center gap-2">
              <Play className="h-4 w-4" />
              Final Renders ({project.finalRenders.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {project.finalRenders.slice(0, 4).map((render, index) => (
                <div key={render._id} className="relative group/render">
                  <video
                    src={render.renderUrl}
                    className="w-full h-20 object-cover rounded-lg bg-neutral-800"
                    muted
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                  <a
                    href={render.renderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover/render:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                  >
                    <Eye className="h-6 w-6 text-white" />
                  </a>
                </div>
              ))}
              {project.finalRenders.length > 4 && (
                <div className="w-full h-20 bg-neutral-800 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-neutral-400">
                    +{project.finalRenders.length - 4} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <a
            href={`/workspace/${project._id}`}
            className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/25"
          >
            <FolderOpen className="h-4 w-4" />
            View Workspace
          </a>
          {project.finalRenders.length > 0 && (
            <a
              href={project.finalRenders[0].renderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-all duration-300"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          )}
        </div>
      </div>
    );
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
            Monitor recent projects and search for users
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-neutral-900/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === "recent"
                  ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/25"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
              }`}
            >
              Recent Projects
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === "search"
                  ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/25"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
              }`}
            >
              Search Users
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === "email"
                  ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/25"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
              }`}
            >
              Email Users
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/25"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
              }`}
            >
              All Users
            </button>
          </div>
        </div>

        {/* Recent Projects Tab */}
        {activeTab === "recent" && (
          <div className="space-y-6">
            {/* Recent Projects Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Recent Projects
                </h2>
                <p className="text-neutral-300">
                  Latest 20 projects with user information and final renders
                </p>
              </div>
              <button
                onClick={fetchRecentProjects}
                disabled={recentProjectsLoading}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:from-purple-400 disabled:to-fuchsia-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    recentProjectsLoading ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>
            </div>

            {/* Recent Projects Grid */}
            {recentProjectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                <span className="ml-2 text-neutral-300">
                  Loading recent projects...
                </span>
              </div>
            ) : recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {recentProjects.map((project) => (
                  <RecentProjectCard key={project._id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-300">No recent projects found</p>
              </div>
            )}
          </div>
        )}

        {/* Search Users Tab */}
        {activeTab === "search" && (
          <div className="space-y-6">
            {/* Search Form */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6">
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
                    onClick={() => searchUser()}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:from-purple-400 disabled:to-fuchsia-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-2xl shadow-purple-500/25"
                  >
                    <Search className="h-4 w-4" />
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Users Tab */}
        {activeTab === "email" && (
          <div className="space-y-6">
            {/* Inactive Users Section */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Inactive Users
                </h2>
                <button
                  onClick={fetchInactiveUsers}
                  disabled={inactiveUsersLoading}
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:from-purple-400 disabled:to-fuchsia-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      inactiveUsersLoading ? "animate-spin" : ""
                    }`}
                  />
                  {inactiveUsersLoading ? "Loading..." : "Load Inactive Users"}
                </button>
              </div>

              {inactiveUsers.length > 0 && (
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-neutral-300 text-sm">
                    Found {inactiveUsers.length} users who haven&apos;t created
                    their first project
                  </p>
                  <button
                    onClick={handleSelectAll}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/25"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {selectedEmails.length === inactiveUsers.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
              )}

              {inactiveUsers.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {inactiveUsers.map((user) => (
                    <div
                      key={user.clerkId}
                      className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(user.email)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmails([
                                ...selectedEmails,
                                user.email,
                              ]);
                            } else {
                              setSelectedEmails(
                                selectedEmails.filter(
                                  (email) => email !== user.email
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-purple-600 bg-neutral-700 border-neutral-600 rounded focus:ring-purple-500"
                        />
                        <div>
                          <div className="text-white font-medium">
                            {user.name || "No name"}
                          </div>
                          <div className="text-neutral-400 text-sm">
                            {user.email}
                          </div>
                          <div className="text-neutral-500 text-xs">
                            Plan: {user.plan} • Signed up {user.daysSinceSignup}{" "}
                            days ago
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {inactiveUsers.length === 0 && !inactiveUsersLoading && (
                <div className="text-center py-8 text-neutral-400">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    No inactive users found or click &quot;Load Inactive
                    Users&quot; to fetch them
                  </p>
                </div>
              )}
            </div>

            {/* Email Composition Section */}
            {selectedEmails.length > 0 && (
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Compose Email ({selectedEmails.length} selected)
                </h3>

                <div className="space-y-4">
                  {/* Template Selection */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      Email Template
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => handleTemplateSelect(e.target.value)}
                      className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
                    >
                      <option value="">Select a template...</option>
                      {EMAIL_TEMPLATES.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name} - {template.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Template Preview */}
                  {selectedTemplate && selectedTemplate !== "custom" && (
                    <div className="bg-neutral-800/50 rounded-lg p-4 border border-white/5">
                      <h4 className="text-sm font-medium text-neutral-200 mb-3">
                        Template Preview:
                      </h4>
                      <div className="text-sm text-neutral-300 space-y-3">
                        {/* Header Preview */}
                        <div className="bg-neutral-700/50 rounded-lg p-3">
                          <div className="text-xs text-neutral-400 mb-1">
                            Header:
                          </div>
                          <div className="font-medium text-white">
                            {
                              EMAIL_TEMPLATES.find(
                                (t) => t.id === selectedTemplate
                              )?.headerTitle
                            }
                          </div>
                          <div className="text-neutral-300 text-xs">
                            {
                              EMAIL_TEMPLATES.find(
                                (t) => t.id === selectedTemplate
                              )?.headerSubtitle
                            }
                          </div>
                        </div>

                        {/* Subject Preview */}
                        <div>
                          <div className="text-xs text-neutral-400 mb-1">
                            Subject:
                          </div>
                          <div className="font-medium text-white">
                            {emailSubject}
                          </div>
                        </div>

                        {/* Message Preview */}
                        <div>
                          <div className="text-xs text-neutral-400 mb-1">
                            Message:
                          </div>
                          <div className="whitespace-pre-wrap text-neutral-300 bg-neutral-700/30 rounded p-2 max-h-32 overflow-y-auto">
                            {emailMessage}
                          </div>
                        </div>

                        {/* Footer Note */}
                        <div className="text-xs text-neutral-500 italic">
                          * All emails include sonexa.cc links in the footer
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-200 mb-2">
                      Message
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="Enter your message..."
                      rows={6}
                      className="w-full px-4 py-2 bg-neutral-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-neutral-400 resize-vertical"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={sendBulkEmails}
                      disabled={
                        sendingEmails ||
                        !emailSubject.trim() ||
                        !emailMessage.trim()
                      }
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-green-400 disabled:to-emerald-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-green-500/25"
                    >
                      <Send className="h-4 w-4" />
                      {sendingEmails ? "Sending..." : "Send Emails"}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedEmails([]);
                        setEmailSubject("");
                        setEmailMessage("");
                        setSelectedTemplate("");
                        setEmailResults(null);
                      }}
                      className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Results */}
            {emailResults && (
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Email Results
                </h3>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {emailResults.total}
                    </div>
                    <div className="text-neutral-400 text-sm">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {emailResults.successful}
                    </div>
                    <div className="text-neutral-400 text-sm">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {emailResults.failed}
                    </div>
                    <div className="text-neutral-400 text-sm">Failed</div>
                  </div>
                </div>

                {emailResults.failedEmails.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-red-400 font-medium mb-2">
                      Failed Emails:
                    </h4>
                    <div className="space-y-1">
                      {emailResults.failedEmails.map((failed, index) => (
                        <div key={index} className="text-sm text-red-300">
                          {failed.email}: {failed.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* All Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Statistics Overview */}
            {usersStatistics && (
              <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Platform Statistics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {usersStatistics.totalUsers}
                    </div>
                    <div className="text-neutral-400 text-sm">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {usersStatistics.usersWithProjects}
                    </div>
                    <div className="text-neutral-400 text-sm">
                      Users with Projects
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {usersStatistics.totalProjects}
                    </div>
                    <div className="text-neutral-400 text-sm">
                      Total Projects
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {usersStatistics.totalFinalRenders}
                    </div>
                    <div className="text-neutral-400 text-sm">
                      Final Renders
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-neutral-300">
                      {usersStatistics.averageProjectsPerUser}
                    </div>
                    <div className="text-neutral-500 text-sm">
                      Avg Projects/User
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-neutral-300">
                      {usersStatistics.averageFinalRendersPerUser}
                    </div>
                    <div className="text-neutral-500 text-sm">
                      Avg Renders/User
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Load Users Button */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users & Projects
                </h2>
                <button
                  onClick={fetchAllUsers}
                  disabled={allUsersLoading}
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 disabled:from-purple-400 disabled:to-fuchsia-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      allUsersLoading ? "animate-spin" : ""
                    }`}
                  />
                  {allUsersLoading ? "Loading..." : "Load All Users"}
                </button>
              </div>
            </div>

            {/* Users List */}
            {allUsers.length > 0 && (
              <div className="space-y-4">
                {allUsers.map((user) => (
                  <div
                    key={user.clerkId}
                    className="bg-neutral-900/80 border border-white/10 rounded-3xl p-6"
                  >
                    {/* User Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                          <User className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {user.name || "No name"}
                          </h3>
                          <p className="text-neutral-400 text-sm">
                            {user.email}
                          </p>
                          <p className="text-neutral-500 text-xs">
                            Plan: {user.plan} • Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedUser(
                            expandedUser === user.clerkId ? null : user.clerkId
                          )
                        }
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {expandedUser === user.clerkId ? "Collapse" : "Expand"}
                      </button>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">
                          {user.totalProjects}
                        </div>
                        <div className="text-neutral-400 text-xs">
                          Total Projects
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-400">
                          {user.activeProjects}
                        </div>
                        <div className="text-neutral-400 text-xs">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-400">
                          {user.failedProjects}
                        </div>
                        <div className="text-neutral-400 text-xs">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-400">
                          {user.projectsWithFinalRenders}
                        </div>
                        <div className="text-neutral-400 text-xs">
                          With Renders
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-400">
                          {user.totalFinalRenders}
                        </div>
                        <div className="text-neutral-400 text-xs">
                          Total Renders
                        </div>
                      </div>
                    </div>

                    {/* Expanded Projects List */}
                    {expandedUser === user.clerkId &&
                      user.projects.length > 0 && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <h4 className="text-md font-semibold text-white mb-3">
                            Projects
                          </h4>
                          <div className="space-y-3">
                            {user.projects.map((project) => (
                              <div
                                key={project._id}
                                className="bg-neutral-800/50 rounded-lg p-4 border border-white/5"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-white font-medium">
                                    {project.name}
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    {project.failed ? (
                                      <span className="text-red-400 text-xs bg-red-500/20 px-2 py-1 rounded">
                                        Failed
                                      </span>
                                    ) : (
                                      <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded">
                                        Active
                                      </span>
                                    )}
                                    <span className="text-neutral-500 text-xs">
                                      {new Date(
                                        project.time_created
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    {project.hasVideo ? (
                                      <CheckCircle className="h-4 w-4 text-green-400" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-neutral-500" />
                                    )}
                                    <span
                                      className={
                                        project.hasVideo
                                          ? "text-green-400"
                                          : "text-neutral-500"
                                      }
                                    >
                                      Video
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {project.hasLyrics ? (
                                      <CheckCircle className="h-4 w-4 text-green-400" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-neutral-500" />
                                    )}
                                    <span
                                      className={
                                        project.hasLyrics
                                          ? "text-green-400"
                                          : "text-neutral-500"
                                      }
                                    >
                                      Lyrics
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {project.hasFinalRender ? (
                                      <CheckCircle className="h-4 w-4 text-green-400" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-neutral-500" />
                                    )}
                                    <span
                                      className={
                                        project.hasFinalRender
                                          ? "text-green-400"
                                          : "text-neutral-500"
                                      }
                                    >
                                      Final Render
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-3 flex gap-3">
                                  <a
                                    href={`/workspace/${project._id}`}
                                    className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/25"
                                  >
                                    <FolderOpen className="h-4 w-4" />
                                    View in Workspace
                                  </a>

                                  {project.hasFinalRender &&
                                    project.finalRenderUrl && (
                                      <a
                                        href={project.finalRenderUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2 transition-all duration-300"
                                      >
                                        <Play className="h-4 w-4" />
                                        View Final Render
                                      </a>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {expandedUser === user.clerkId &&
                      user.projects.length === 0 && (
                        <div className="mt-4 border-t border-white/10 pt-4 text-center text-neutral-400">
                          <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No projects created yet</p>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            {allUsers.length === 0 && !allUsersLoading && (
              <div className="text-center py-12 text-neutral-400">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>
                  No users loaded. Click &quot;Load All Users&quot; to fetch
                  user data.
                </p>
              </div>
            )}
          </div>
        )}

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

        {/* User Projects Display - Only show in search tab */}
        {activeTab === "search" && userProjects && (
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
                            {project.finalRender &&
                              project.finalRender.length > 0 && (
                                <a
                                  href={project.finalRender[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Play className="h-4 w-4" />
                                  View Final Render
                                </a>
                              )}

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
