import { convertDBStructureToNodes } from '@/components/ERDRenderer/convertDBStructureToNodes'
import { openRelatedTablesLogEvent } from '@/features/gtm/utils'
import { useVersion } from '@/providers'
import {
  replaceHiddenNodeIds,
  updateActiveTableName,
  useDBStructureStore,
} from '@/stores'
import type { Table } from '@liam-hq/db-structure'
import { GotoIcon, IconButton, Waypoints as WaypointsIcon } from '@liam-hq/ui'
import { ReactFlowProvider, useReactFlow } from '@xyflow/react'
import { type FC, type MouseEvent, useCallback } from 'react'
import { ERDContent } from '../../../ERDContent'
import { CollapsibleHeader } from '../CollapsibleHeader'
import styles from './RelatedTables.module.css'
import { extractDBStructureForTable } from './extractDBStructureForTable'

type Props = {
  table: Table
}

export const RelatedTables: FC<Props> = ({ table }) => {
  const dbStructure = useDBStructureStore()
  const extractedDBStructure = extractDBStructureForTable(table, dbStructure)
  const { nodes, edges } = convertDBStructureToNodes({
    dbStructure: extractedDBStructure,
    showMode: 'TABLE_NAME',
  })
  const { getNodes } = useReactFlow()
  const { version } = useVersion()
  const handleClick = useCallback(
    (event: MouseEvent) => {
      const visibleNodeIds: string[] = nodes.map((node) => node.id)
      const mainPaneNodes = getNodes()
      const hiddenNodeIds = mainPaneNodes
        .filter((node) => !visibleNodeIds.includes(node.id))
        .map((node) => node.id)

      event.stopPropagation()
      replaceHiddenNodeIds(hiddenNodeIds)
      updateActiveTableName(undefined)
      openRelatedTablesLogEvent({
        tableId: table.name,
        platform: version.displayedOn,
        gitHash: version.gitHash,
        ver: version.version,
        appEnv: version.envName,
      })
    },
    [nodes, getNodes, table.name, version],
  )

  return (
    <CollapsibleHeader
      title="Related tables"
      icon={<WaypointsIcon width={12} />}
      isContentVisible={true}
      // NOTE: Header height for Columns/Indices/Unique sections:
      // (40px (content) + 1px (borders)) * 3 = 123px
      stickyTopHeight={123}
      // NOTE: 360px is the height of the content
      contentMaxHeight={360}
      additionalButtons={
        <IconButton
          icon={<GotoIcon />}
          tooltipContent="Open in main area"
          onClick={handleClick}
        />
      }
    >
      <div className={styles.outerWrapper}>
        <div className={styles.contentWrapper}>
          <ReactFlowProvider>
            <ERDContent
              nodes={nodes}
              edges={edges}
              enabledFeatures={{
                fitViewWhenActiveTableChange: false,
                initialFitViewToActiveTable: false,
              }}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </CollapsibleHeader>
  )
}
