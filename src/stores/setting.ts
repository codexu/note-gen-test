import { Store } from '@tauri-apps/plugin-store'
import { create } from 'zustand'
import { getVersion } from '@tauri-apps/api/app'

export enum GenTemplateRange {
  All = '全部',
  Today = '今天',
  Week = '近一周',
  Month = '近一月',
  ThreeMonth = '近三个月',
  Year = '近一年',
}

export interface GenTemplate {
  id: string
  title: string
  status: boolean
  content: string
  range: GenTemplateRange
}

interface SettingState {
  initSettingData: () => Promise<void>

  version: string
  setVersion:  () => Promise<void>

  autoUpdate: boolean
  setAutoUpdate: (autoUpdate: boolean) => void

  language: string
  setLanguage: (language: string) => void

  aiType: string
  setAiType: (aiType: string) => void

  baseURL: string
  setBaseURL: (baseURL: string) => void

  apiKey: string
  setApiKey: (apiKey: string) => void

  model: string
  setModel: (language: string) => void

  placeholderModel: string
  setPlaceholderModel: (placeholderModel: string) => Promise<void>

  translateModel: string
  setTranslateModel: (translateModel: string) => Promise<void>

  markDescModel: string
  setMarkDescModel: (markDescModel: string) => Promise<void>

  embeddingModel: string
  setEmbeddingModel: (embeddingModel: string) => Promise<void>

  rerankingModel: string
  setRerankingModel: (rerankingModel: string) => Promise<void>

  templateList: GenTemplate[]
  setTemplateList: (templateList: GenTemplate[]) => Promise<void>

  darkMode: string
  setDarkMode: (darkMode: string) => void

  previewTheme: string
  setPreviewTheme: (previewTheme: string) => void

  codeTheme: string
  setCodeTheme: (codeTheme: string) => void

  tesseractList: string
  setTesseractList: (tesseractList: string) => void

  // Github 相关设置
  githubUsername: string
  setGithubUsername: (githubUsername: string) => Promise<void>

  accessToken: string
  setAccessToken: (accessToken: string) => void

  jsdelivr: boolean
  setJsdelivr: (jsdelivr: boolean) => void

  useImageRepo: boolean
  setUseImageRepo: (useImageRepo: boolean) => Promise<void>

  autoSync: string
  setAutoSync: (autoSync: string) => Promise<void>
  
  // Gitee 相关设置
  giteeAccessToken: string
  setGiteeAccessToken: (giteeAccessToken: string) => void

  giteeAutoSync: string
  setGiteeAutoSync: (giteeAutoSync: string) => Promise<void>
  
  // 主要备份方式设置
  primaryBackupMethod: 'github' | 'gitee'
  setPrimaryBackupMethod: (method: 'github' | 'gitee') => Promise<void>
  
  lastSettingPage: string
  setLastSettingPage: (page: string) => Promise<void>

  workspacePath: string
  setWorkspacePath: (path: string) => Promise<void>
}


const useSettingStore = create<SettingState>((set, get) => ({
  initSettingData: async () => {
    const store = await Store.load('store.json');
    await get().setVersion()
    Object.entries(get()).forEach(async([key, value]) => {
      const res = await store.get(key)
      if (typeof value === 'function') return
      if (res !== undefined && key!== 'version') {
        if (key === 'templateList') {
          set({ [key]: [] })
          setTimeout(() => {
            set({ [key]: res as GenTemplate[] })
          }, 0);
        } else {
          set({ [key]: res })
        }
      } else {
        await store.set(key, value)
      }
    })
  },

  version: '',
  setVersion: async() => {
    const version = await getVersion()
    set({ version })
  },

  autoUpdate: true,
  setAutoUpdate: (autoUpdate) => set({ autoUpdate }),

  language: '简体中文',
  setLanguage: (language) => set({ language }),

  aiType: 'chatgpt',
  setAiType: (aiType) => set({ aiType }),

  baseURL: '',
  setBaseURL: (baseURL) => set({ baseURL }),

  apiKey: '',
  setApiKey: (apiKey) => set({ apiKey }),

  model: '',
  setModel: (model) => set({ model }),

  placeholderModel: '',
  setPlaceholderModel: async (placeholderModel) => {
    const store = await Store.load('store.json');
    await store.set('placeholderModel', placeholderModel)
    set({ placeholderModel })
  },

  translateModel: '',
  setTranslateModel: async (translateModel) => {
    const store = await Store.load('store.json');
    await store.set('translateModel', translateModel)
    set({ translateModel })
  },

  markDescModel: '',
  setMarkDescModel: async (markDescModel) => {
    const store = await Store.load('store.json');
    await store.set('markDescModel', markDescModel)
    set({ markDescModel })
  },

  embeddingModel: '',
  setEmbeddingModel: async (embeddingModel) => {
    const store = await Store.load('store.json');
    await store.set('embeddingModel', embeddingModel)
    set({ embeddingModel })
  },

  rerankingModel: '',
  setRerankingModel: async (rerankingModel) => {
    const store = await Store.load('store.json');
    await store.set('rerankingModel', rerankingModel)
    set({ rerankingModel })
  },

  templateList: [
    {
      id: '0',
      title: '笔记',
      content: `整理成一篇详细完整的笔记。
满足以下格式要求：
- 如果是代码，必须完整保留，不要随意生成。
- 文字复制的内容尽量不要修改，只处理格式化后的内容。`,
      status: true,
      range: GenTemplateRange.All
    },
    {
      id: '1',
      title: '周报',
      content: '最近一周的记录整理成一篇周报，将每条记录形成一句总结，每条不超过50字。',
      status: true,
      range: GenTemplateRange.Week
    }
  ],
  setTemplateList: async (templateList) => {
    set({ templateList })
    const store = await Store.load('store.json')
    await store.set('templateList', templateList)
  },

  darkMode: 'system',
  setDarkMode: (darkMode) => set({ darkMode }),

  previewTheme: 'github',
  setPreviewTheme: (previewTheme) => set({ previewTheme }),

  codeTheme: 'github',
  setCodeTheme: (codeTheme) => set({ codeTheme }),

  tesseractList: 'eng,chi_sim',
  setTesseractList: (tesseractList) => set({ tesseractList }),

  githubUsername: '',
  setGithubUsername: async(githubUsername) => {
    set({ githubUsername })
    const store = await Store.load('store.json');
    store.set('githubUsername', githubUsername)
  },

  accessToken: '',
  setAccessToken: async (accessToken) => {
    const store = await Store.load('store.json');
    const hasAccessToken = await store.get('accessToken') === accessToken
    if (!hasAccessToken) {
      await get().setGithubUsername('')
    }
    set({ accessToken })
  },

  jsdelivr: true,
  setJsdelivr: async (jsdelivr: boolean) => {
    set({ jsdelivr })
    const store = await Store.load('store.json');
    await store.set('jsdelivr', jsdelivr)
  },

  useImageRepo: true,
  setUseImageRepo: async (useImageRepo: boolean) => {
    set({ useImageRepo })
    const store = await Store.load('store.json');
    await store.set('useImageRepo', useImageRepo)
  },

  autoSync: 'disabled',
  setAutoSync: async (autoSync: string) => {
    set({ autoSync })
    const store = await Store.load('store.json');
    await store.set('autoSync', autoSync)
  },
  
  lastSettingPage: 'ai',
  setLastSettingPage: async (page: string) => {
    set({ lastSettingPage: page })
    const store = await Store.load('store.json');
    await store.set('lastSettingPage', page)
  },

  workspacePath: '',
  setWorkspacePath: async (path: string) => {
    set({ workspacePath: path })
    const store = await Store.load('store.json');
    await store.set('workspacePath', path)
  },
  
  // Gitee 相关设置
  giteeAccessToken: '',
  setGiteeAccessToken: async (giteeAccessToken: string) => {
    set({ giteeAccessToken })
    const store = await Store.load('store.json');
    await store.set('giteeAccessToken', giteeAccessToken)
  },

  giteeAutoSync: 'disabled',
  setGiteeAutoSync: async (giteeAutoSync: string) => {
    set({ giteeAutoSync })
    const store = await Store.load('store.json');
    await store.set('giteeAutoSync', giteeAutoSync)
  },
  
  // 默认使用 GitHub 作为主要备份方式
  primaryBackupMethod: 'github',
  setPrimaryBackupMethod: async (method: 'github' | 'gitee') => {
    set({ primaryBackupMethod: method })
    const store = await Store.load('store.json');
    await store.set('primaryBackupMethod', method)
  }
}))

export default useSettingStore