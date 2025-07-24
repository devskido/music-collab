import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiCall } from "../utils/supabase/client";
import { useAuth } from "./AuthContext";
import { Search, Filter, MapPin, Music, Loader2 } from "lucide-react";

interface Musician {
  id: string;
  name: string;
  role: string;
  location: string;
  profileImage: string;
  skills: string[];
  bio: string;
  stats: {
    projects: number;
    collaborations: number;
    credits: number;
  };
}

export function DiscoverPage() {
  const { user } = useAuth();
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");

  const fetchMusicians = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedRole !== 'all') params.append('role', selectedRole);
      if (selectedGenre !== 'all') params.append('genre', selectedGenre);
      if (searchTerm) params.append('search', searchTerm);

      const data = await apiCall(`/discover?${params.toString()}`);
      
      // Filter out current user from results
      const filteredData = user ? data.filter((m: Musician) => m.id !== user.id) : data;
      setMusicians(filteredData);
    } catch (error) {
      console.error('Error fetching musicians:', error);
      setMusicians([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusicians();
  }, [selectedRole, selectedGenre, user]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.length >= 2 || searchTerm.length === 0) {
        fetchMusicians();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleConnect = async (musicianId: string) => {
    // TODO: Implement connection functionality
    console.log('Connecting to musician:', musicianId);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg mb-2">Sign in to discover musicians</h3>
          <p className="text-muted-foreground">
            Create an account or sign in to find talented collaborators
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-4">Discover Musicians & Producers</h1>
        <p className="text-muted-foreground mb-6">
          Find talented collaborators for your next project
        </p>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="producer">Producer</SelectItem>
              <SelectItem value="vocalist">Vocalist</SelectItem>
              <SelectItem value="guitarist">Guitarist</SelectItem>
              <SelectItem value="songwriter">Songwriter</SelectItem>
              <SelectItem value="drummer">Drummer</SelectItem>
              <SelectItem value="keyboardist">Keyboardist</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full md:w-48">
              <Music className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="hip-hop">Hip-Hop</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="jazz">Jazz</SelectItem>
              <SelectItem value="country">Country</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Results */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicians.map((musician) => (
            <Card key={musician.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <ImageWithFallback
                    src={musician.profileImage || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`}
                    alt={musician.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{musician.name}</CardTitle>
                    <p className="text-muted-foreground">{musician.role}</p>
                    {musician.location && (
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {musician.location}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {musician.bio && (
                  <p className="text-sm text-muted-foreground">{musician.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {musician.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {musician.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{musician.skills.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {musician.stats?.projects || 0} projects
                  </span>
                  <span className="text-muted-foreground">
                    {musician.stats?.collaborations || 0} collaborations
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleConnect(musician.id)}
                  >
                    Connect
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!loading && musicians.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg mb-2">No musicians found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
}