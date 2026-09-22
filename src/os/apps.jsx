import WelcomeWindow from './apps/WelcomeWindow'
import AboutWindow from './apps/AboutWindow'
import SkillsWindow from './apps/SkillsWindow'
import ProjectsWindow from './apps/ProjectsWindow'
import AiLabWindow from './apps/AiLabWindow'
import ExperienceWindow from './apps/ExperienceWindow'
import CredentialsWindow from './apps/CredentialsWindow'
import PersonalityWindow from './apps/PersonalityWindow'
import TerminalWindow from './apps/TerminalWindow'
import GitHubWindow from './apps/GitHubWindow'
import ContactWindow from './apps/ContactWindow'

export const APPS = [
  { id: 'welcome', title: 'Welcome', icon: 'sparkles', accent: '#818cf8', w: 520, h: 560, component: WelcomeWindow },
  { id: 'about', title: 'About', icon: 'user', accent: '#60a5fa', w: 620, h: 480, component: AboutWindow },
  { id: 'skills', title: 'Toolbox', icon: 'code', accent: '#34d399', w: 680, h: 520, component: SkillsWindow },
  { id: 'projects', title: 'Projects', icon: 'rocket', accent: '#a78bfa', w: 780, h: 600, component: ProjectsWindow },
  { id: 'ai-lab', title: 'AI Lab', icon: 'bolt', accent: '#e879f9', w: 660, h: 540, component: AiLabWindow },
  { id: 'experience', title: 'Path', icon: 'book', accent: '#fbbf24', w: 680, h: 560, component: ExperienceWindow },
  { id: 'credentials', title: 'Credentials', icon: 'trophy', accent: '#f472b6', w: 660, h: 540, component: CredentialsWindow },
  { id: 'personality', title: 'Personality', icon: 'sparkles', accent: '#22d3ee', w: 580, h: 500, component: PersonalityWindow },
  { id: 'terminal', title: 'Terminal', icon: 'terminal', accent: '#a3e635', w: 640, h: 460, component: TerminalWindow },
  { id: 'github', title: 'GitHub', icon: 'github', accent: '#94a3b8', w: 740, h: 560, component: GitHubWindow },
  { id: 'contact', title: 'Say hi', icon: 'chat', accent: '#f87171', w: 500, h: 540, component: ContactWindow }
]

export const DOCK_APPS = ['about', 'projects', 'ai-lab', 'terminal', 'github', 'contact']