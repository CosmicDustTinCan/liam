import { dbStructureSchema } from '@liam-hq/db-structure'
import {
  ERDRenderer,
  VersionProvider,
  initDBStructureStore,
  versionSchema,
} from '@liam-hq/erd-core'
import SearchOverlay from '@liam-hq/erd-core/src/components/Search/SearchOverlay'
import * as v from 'valibot'

async function loadSchemaContent() {
  try {
    const response = await fetch('./schema.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.statusText}`)
    }
    const data = await response.json()
    const result = v.safeParse(dbStructureSchema, data)
    result.success
      ? initDBStructureStore(result.output)
      : console.info(result.issues)
  } catch (error) {
    console.error('Error loading schema content:', error)
  }
}

loadSchemaContent()

const versionData = {
  version: import.meta.env.VITE_CLI_VERSION_VERSION,
  gitHash: import.meta.env.VITE_CLI_VERSION_GIT_HASH,
  envName: import.meta.env.VITE_CLI_VERSION_ENV_NAME,
  isReleasedGitHash:
    import.meta.env.VITE_CLI_VERSION_IS_RELEASED_GIT_HASH === '1',
  date: import.meta.env.VITE_CLI_VERSION_DATE,
  displayedOn: 'cli',
}
const version = v.parse(versionSchema, versionData)

function getSidebarStateFromCookie(): boolean {
  const cookies = document.cookie.split('; ').map((cookie) => cookie.split('='))
  const cookie = cookies.find(([key]) => key === 'sidebar:state')
  return cookie ? cookie[1] === 'true' : false
}

function App() {
  const defaultSidebarOpen = getSidebarStateFromCookie()

  return (
    <VersionProvider version={version}>
      <ERDRenderer defaultSidebarOpen={defaultSidebarOpen} />
      <SearchOverlay />
    </VersionProvider>
  )
}

export default App
