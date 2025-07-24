import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CreateProjectModal } from "./CreateProjectModal";
import { useAuth } from "./AuthContext";
import { apiCall } from "../utils/supabase/client";
import { Plus, Users, Calendar, Music, MessageSquare, Upload, Loader2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  genre: string;
  status: "planning" | "recording" | "mixing" | "completed";
  progress: number;
  collaborators: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
  }>;
  deadline: string;
  createdAt: string;
  files: any[];
  messages: any[];
}

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "planning": return "bg-blue-500";
    case "recording": return "bg-yellow-500";
    case "mixing": return "bg-orange-500";
    case "completed": return "bg-green-500";
  }
};

const getStatusLabel = (status: Project["status"]) => {
  switch (status) {
    case "planning": return "Planning";
    case "recording": return "Recording";
    case "mixing": return "Mixing";
    case "completed": return "Completed";
  }
};

export function ProjectsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await apiCall(`/projects/user/${user.id}`);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleProjectCreated = () => {
    fetchProjects();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg mb-2">Sign in to manage projects</h3>
          <p className="text-muted-foreground">
            Create an account or sign in to start collaborating on music projects
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl mb-2">Projects</h1>
            <p className="text-muted-foreground">
              Manage your collaborations and creative projects
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : projects.length > 0 ? (
              <div className="grid gap-6">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="flex items-center gap-2">
                            {project.title}
                            <Badge variant="outline" className="text-xs">
                              {project.genre}
                            </Badge>
                          </CardTitle>
                          <p className="text-muted-foreground">{project.description}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(project.status)} text-white`}
                        >
                          {getStatusLabel(project.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{project.collaborators.length} collaborators</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-muted-foreground" />
                          <span>{project.files?.length || 0} files</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {project.collaborators.map((collaborator) => (
                            <ImageWithFallback
                              key={collaborator.id}
                              src={collaborator.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face`}
                              alt={collaborator.name}
                              className="w-8 h-8 rounded-full border-2 border-background object-cover"
                            />
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat ({project.messages?.length || 0})
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Files
                          </Button>
                          <Button size="sm">Open Project</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project to start collaborating with other musicians
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg mb-2">No collaborations yet</h3>
              <p className="text-muted-foreground mb-4">
                Join other artists' projects or invite collaborators to yours
              </p>
              <Button>Browse Open Projects</Button>
            </div>
          </TabsContent>

          <TabsContent value="discover" className="space-y-6">
            <div className="text-center py-12">
              <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg mb-2">Discover Open Projects</h3>
              <p className="text-muted-foreground mb-4">
                Find exciting projects that need your skills
              </p>
              <Button>Explore Projects</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <CreateProjectModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
}