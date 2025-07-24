import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MapPin, Calendar, Music, Award, Users, MessageCircle } from "lucide-react";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    role: string;
    location: string;
    bio: string;
    profileImage: string;
    skills: string[];
    credits: Array<{
      title: string;
      artist: string;
      role: string;
      year: string;
    }>;
    projects: string[] | Array<{
      title: string;
      description: string;
      collaborators: number;
      genre: string;
    }>;
    stats: {
      projects: number;
      collaborations: number;
      credits: number;
    };
  };
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Header */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <ImageWithFallback
                  src={user.profileImage}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
                />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl mb-2">{user.name}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{user.role}</p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Active since 2020
                    </div>
                  </div>
                  <p className="mb-4">{user.bio}</p>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <Button>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Collaborate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Music className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl">{user.stats.projects}</div>
                <p className="text-sm text-muted-foreground">Projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl">{user.stats.collaborations}</div>
                <p className="text-sm text-muted-foreground">Collaborations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl">{user.stats.credits}</div>
                <p className="text-sm text-muted-foreground">Credits</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Genres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.isArray(user.projects) && user.projects.length > 0 ? (
              (typeof user.projects[0] === 'string' ? 
                // Handle case where projects is array of IDs
                [
                  { title: "Project Loading...", description: "Project data will be loaded", genre: "Various", collaborators: 1 }
                ] :
                // Handle case where projects is array of project objects
                user.projects as Array<{title: string; description: string; collaborators: number; genre: string}>
              ).slice(0, 3).map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="mb-1">{project.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <Badge variant="outline">{project.genre}</Badge>
                    <span className="text-muted-foreground">
                      {project.collaborators} collaborators
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Music className="h-8 w-8 mx-auto mb-2" />
                <p>No projects yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Career Credits */}
        <Card>
          <CardHeader>
            <CardTitle>Career Credits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.credits && user.credits.length > 0 ? (
              user.credits.map((credit, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="mb-1">{credit.title}</h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    by {credit.artist}
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <Badge variant="outline">{credit.role}</Badge>
                    <span className="text-muted-foreground">{credit.year}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-8 w-8 mx-auto mb-2" />
                <p>No credits yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}