import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Music2, Users, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="container px-4 py-16 md:py-24">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl tracking-tight">
            Connect. Create. Collaborate.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The ultimate platform for musicians and producers to showcase their work, 
            find collaborators, and bring creative projects to life.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="text-lg px-8">
            Start Creating
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            Explore Talent
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
          <Card className="p-6 text-center">
            <Music2 className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="mb-2">Showcase Your Work</h3>
            <p className="text-muted-foreground">
              Create a professional profile highlighting your credits, projects, and musical expertise.
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="mb-2">Find Collaborators</h3>
            <p className="text-muted-foreground">
              Connect with like-minded musicians and producers based on skills and musical interests.
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="mb-2">Create Together</h3>
            <p className="text-muted-foreground">
              Collaborate on projects with built-in tools for communication and file sharing.
            </p>
          </Card>
        </div>
        
        <div className="mt-16 w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl mb-4">Featured Collaborators</h2>
            <p className="text-muted-foreground">Join thousands of talented musicians and producers</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Alex Rivera", role: "Producer", skills: ["Hip-Hop", "R&B"] },
              { name: "Sarah Chen", role: "Vocalist", skills: ["Pop", "Jazz"] },
              { name: "Marcus Jones", role: "Guitarist", skills: ["Rock", "Blues"] },
              { name: "Lisa Kim", role: "Songwriter", skills: ["Country", "Folk"] }
            ].map((artist, index) => (
              <Card key={index} className="p-4 text-center">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-${1500000000 + index}?w=80&h=80&fit=crop&crop=face`}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                />
                <h4 className="text-sm mb-1">{artist.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{artist.role}</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {artist.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}