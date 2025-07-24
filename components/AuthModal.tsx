import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { signUp, signIn } from '../utils/supabase/client'
import { X, Music } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const musicRoles = [
  'Producer',
  'Vocalist',
  'Songwriter',
  'Guitarist',
  'Bassist',
  'Drummer',
  'Keyboardist',
  'Sound Engineer',
  'Mixing Engineer',
  'Mastering Engineer',
  'Music Director',
  'Session Musician'
]

const musicGenres = [
  'Hip-Hop',
  'Pop',
  'Rock',
  'R&B',
  'Electronic',
  'Jazz',
  'Country',
  'Folk',
  'Classical',
  'Blues',
  'Reggae',
  'Latin',
  'Trap',
  'House',
  'Ambient',
  'Indie'
]

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('') // Can be email or username
  const [signInPassword, setSignInPassword] = useState('')
  
  // Sign Up State
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpUsername, setSignUpUsername] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Check if the identifier is an email or username
      const isEmail = signInIdentifier.includes('@')
      
      if (isEmail) {
        await signIn(signInIdentifier, signInPassword)
      } else {
        // For username login, we need to implement a different approach
        // This would require a backend endpoint to look up email by username
        setError('Username login coming soon. Please use your email for now.')
        setLoading(false)
        return
      }
      
      onClose()
    } catch (err: any) {
      setError(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (!name.trim() || !signUpUsername.trim() || !role || selectedSkills.length === 0) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }
    
    try {
      await signUp(signUpEmail, signUpPassword, name, signUpUsername, role, selectedSkills)
      // Now sign them in
      await signIn(signUpEmail, signUpPassword)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const resetForm = () => {
    setError('')
    setSignInIdentifier('')
    setSignInPassword('')
    setSignUpEmail('')
    setSignUpPassword('')
    setSignUpUsername('')
    setName('')
    setRole('')
    setSelectedSkills([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm()
        onClose()
      }
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Welcome to MusicCollab
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-identifier">Email or Username</Label>
                <Input
                  id="signin-identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username *</Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email *</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password *</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Primary Role *</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary role" />
                  </SelectTrigger>
                  <SelectContent>
                    {musicRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Skills & Genres * (Select at least 1)</Label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                  {musicGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedSkills.includes(genre) ? "default" : "outline"}
                      className="cursor-pointer text-xs justify-center"
                      onClick={() => toggleSkill(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedSkills.length} skills
                </p>
              </div>
              
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}