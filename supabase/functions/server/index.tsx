import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Initialize storage bucket
const initializeStorage = async () => {
  const bucketName = 'make-549d2100-music-files'
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName)
      console.log(`Created bucket: ${bucketName}`)
    }
  } catch (error) {
    console.log(`Error initializing storage: ${error}`)
  }
}

initializeStorage()

// Helper function to verify user authentication
const getAuthenticatedUser = async (request: Request) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]
  if (!accessToken) {
    return null
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error || !user) {
    return null
  }
  
  return user
}

// Auth routes
app.post('/make-server-549d2100/auth/signup', async (c) => {
  try {
    const { email, password, name, role, skills } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, skills },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })
    
    if (error) {
      console.log(`Signup error: ${error}`)
      return c.json({ error: error.message }, 400)
    }
    
    // Create user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      name,
      role,
      email,
      skills: skills || [],
      bio: '',
      location: '',
      profileImage: '',
      stats: { projects: 0, collaborations: 0, credits: 0 },
      credits: [],
      projects: [],
      createdAt: new Date().toISOString()
    })
    
    return c.json({ user: data.user })
  } catch (error) {
    console.log(`Signup error: ${error}`)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Profile routes
app.get('/make-server-549d2100/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const profile = await kv.get(`user:${userId}`)
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    return c.json(profile)
  } catch (error) {
    console.log(`Get profile error: ${error}`)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.put('/make-server-549d2100/profile', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const updates = await c.req.json()
    const existingProfile = await kv.get(`user:${user.id}`)
    
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    const updatedProfile = { ...existingProfile, ...updates, id: user.id }
    await kv.set(`user:${user.id}`, updatedProfile)
    
    return c.json(updatedProfile)
  } catch (error) {
    console.log(`Update profile error: ${error}`)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Discovery routes
app.get('/make-server-549d2100/discover', async (c) => {
  try {
    const { role, genre, search } = c.req.query()
    const profiles = await kv.getByPrefix('user:')
    
    let filteredProfiles = profiles.filter(profile => profile && profile.name)
    
    if (role && role !== 'all') {
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.role.toLowerCase().includes(role.toLowerCase())
      )
    }
    
    if (genre && genre !== 'all') {
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.skills.some((skill: string) => 
          skill.toLowerCase().includes(genre.toLowerCase())
        )
      )
    }
    
    if (search) {
      filteredProfiles = filteredProfiles.filter(profile => 
        profile.name.toLowerCase().includes(search.toLowerCase()) ||
        profile.bio.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    return c.json(filteredProfiles.slice(0, 20)) // Limit results
  } catch (error) {
    console.log(`Discovery error: ${error}`)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Project routes
app.post('/make-server-549d2100/projects', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const { title, description, genre, deadline } = await c.req.json()
    const projectId = crypto.randomUUID()
    
    const project = {
      id: projectId,
      title,
      description,
      genre,
      deadline,
      ownerId: user.id,
      status: 'planning',
      progress: 0,
      collaborators: [{
        id: user.id,
        name: user.user_metadata?.name || 'Unknown',
        role: user.user_metadata?.role || 'Owner',
        avatar: ''
      }],
      files: [],
      messages: [],
      createdAt: new Date().toISOString()
    }
    
    await kv.set(`project:${projectId}`, project)
    
    // Add project to user's profile
    const userProfile = await kv.get(`user:${user.id}`)
    if (userProfile) {
      userProfile.projects.push({
        id: projectId,
        title,
        description,
        genre,
        collaborators: 1
      })
      userProfile.stats.projects += 1
      await kv.set(`user:${user.id}`, userProfile)
    }
    
    return c.json(project)
  } catch (error) {
    console.log(`Create project error: ${error}`)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/make-server-549d2100/projects/user/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const projects = await kv.getByPrefix('project:')
    
    const userProjects = projects.filter(project => 
      project.ownerId === userId || 
      project.collaborators.some((collab: any) => collab.id === userId)
    )
    
    return c.json(userProjects)
  } catch (error) {
    console.log(`Get user projects error: ${error}`)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/make-server-549d2100/projects/:projectId', async (c) => {
  try {
    const projectId = c.req.param('projectId')
    const project = await kv.get(`project:${projectId}`)
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    return c.json(project)
  } catch (error) {
    console.log(`Get project error: ${error}`)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.put('/make-server-549d2100/projects/:projectId', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const projectId = c.req.param('projectId')
    const project = await kv.get(`project:${projectId}`)
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    // Check if user is owner or collaborator
    const isAuthorized = project.ownerId === user.id || 
      project.collaborators.some((collab: any) => collab.id === user.id)
    
    if (!isAuthorized) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    
    const updates = await c.req.json()
    const updatedProject = { ...project, ...updates }
    await kv.set(`project:${projectId}`, updatedProject)
    
    return c.json(updatedProject)
  } catch (error) {
    console.log(`Update project error: ${error}`)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// File upload routes
app.post('/make-server-549d2100/projects/:projectId/files', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    const projectId = c.req.param('projectId')
    const project = await kv.get(`project:${projectId}`)
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404)
    }
    
    // Check if user is collaborator
    const isCollaborator = project.collaborators.some((collab: any) => collab.id === user.id)
    if (!isCollaborator) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }
    
    const fileId = crypto.randomUUID()
    const fileName = `${projectId}/${fileId}-${file.name}`
    
    const { data, error } = await supabase.storage
      .from('make-549d2100-music-files')
      .upload(fileName, file)
    
    if (error) {
      console.log(`File upload error: ${error}`)
      return c.json({ error: 'File upload failed' }, 500)
    }
    
    // Get signed URL for the uploaded file
    const { data: signedUrlData } = await supabase.storage
      .from('make-549d2100-music-files')
      .createSignedUrl(fileName, 3600) // 1 hour expiry
    
    const fileInfo = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      path: fileName,
      signedUrl: signedUrlData?.signedUrl
    }
    
    // Add file to project
    project.files = project.files || []
    project.files.push(fileInfo)
    await kv.set(`project:${projectId}`, project)
    
    return c.json(fileInfo)
  } catch (error) {
    console.log(`File upload error: ${error}`)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/make-server-549d2100/', (c) => c.text('Music Collaboration Platform API'))

Deno.serve(app.fetch)