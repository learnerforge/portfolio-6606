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
  { id: 'welcome', title: 'Welcome', icon: 'sparkles', w: 520, h: 560, component: WelcomeWindow },
  { id: 'about', title: 'About', icon: 'user', w: 620, h: 480, component: AboutWindow },
  { id: 'skills', title: 'Toolbox', icon: 'code', w: 680, h: 520, component: SkillsWindow },
  { id: 'projects', title: 'Projects', icon: 'rocket', w: 780, h: 600, component: ProjectsWindow },
  { id: 'ai-lab', title: 'AI Lab', icon: 'bolt', w: 660, h: 540, component: AiLabWindow },
  { id: 'experience', title: 'Path', icon: 'book', w: 680, h: 560, component: ExperienceWindow },
  { id: 'credentials', title: 'Credentials', icon: 'trophy', w: 660, h: 540, component: CredentialsWindow },
  { id: 'personality', title: 'Personality', icon: 'sparkles', w: 580, h: 500, component: PersonalityWindow },
  { id: 'terminal', title: 'Terminal', icon: 'terminal', w: 640, h: 460, component: TerminalWindow },
  { id: 'github', title: 'GitHub', icon: 'github', w: 740, h: 560, component: GitHubWindow },
  { id: 'contact', title: 'Say hi', icon: 'chat', w: 500, h: 540, component: ContactWindow }
]

export const DOCK_APPS = ['about', 'projects', 'ai-lab', 'terminal', 'github', 'contact']