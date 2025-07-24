import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { useAuth } from "./AuthContext";
import { AuthModal } from "./AuthModal";
import { Music, User, Settings, LogOut } from "lucide-react";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <button 
              className="mr-6 flex items-center space-x-2 hover:opacity-80 transition-opacity" 
              onClick={() => onNavigate('home')}
            >
              <Music className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                MusicCollab
              </span>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => onNavigate('discover')} 
                className={`transition-colors hover:text-foreground/80 ${
                  currentPage === 'discover' ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Discover
              </button>
              <button 
                onClick={() => onNavigate('projects')} 
                className={`transition-colors hover:text-foreground/80 ${
                  currentPage === 'projects' ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Projects
              </button>
              <button 
                onClick={() => onNavigate('community')} 
                className={`transition-colors hover:text-foreground/80 ${
                  currentPage === 'community' ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                Community
              </button>
            </nav>
            <div className="flex items-center space-x-2">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.user_metadata?.name || 'User'} />
                        <AvatarFallback>
                          {getInitials(user.user_metadata?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.user_metadata?.name || 'User'}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => setShowAuthModal(true)}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}