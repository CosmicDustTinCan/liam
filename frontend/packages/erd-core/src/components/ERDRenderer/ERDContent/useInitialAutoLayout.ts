import { useCustomReactflow } from '@/features/reactflow/hooks'
import {
  addHiddenNodeIds,
  updateActiveTableName,
  updateShowMode,
} from '@/stores'
import {
  getActiveTableNameFromUrl,
  getHiddenNodeIdsFromUrl,
  getShowModeFromUrl,
} from '@/utils'
import { type Node, useReactFlow } from '@xyflow/react'
import { useCallback, useEffect, useMemo } from 'react'
import { useERDContentContext } from './ERDContentContext'
import { highlightNodesAndEdges } from './highlightNodesAndEdges'
import { useAutoLayout } from './useAutoLayout'

export const useInitialAutoLayout = (
  nodes: Node[],
  shouldFitViewToActiveTable: boolean,
) => {
  const tableNodesInitialized = useMemo(
    () =>
      nodes
        .filter((node) => node.type === 'table')
        .some((node) => node.measured),
    [nodes],
  )
  const { getEdges, setNodes, setEdges } = useReactFlow()
  const { fitView } = useCustomReactflow()
  const {
    actions: { setLoading, setInitializeComplete },
  } = useERDContentContext()

  const {
    state: { initializeComplete },
  } = useERDContentContext()
  const { handleLayout } = useAutoLayout()

  const initialize = useCallback(async () => {
    if (initializeComplete) {
      return
    }

    const activeTableName = getActiveTableNameFromUrl()
    updateActiveTableName(activeTableName)

    const hiddenNodeIds = await getHiddenNodeIdsFromUrl()
    addHiddenNodeIds(hiddenNodeIds)

    const showMode = getShowModeFromUrl()
    updateShowMode(showMode)

    if (tableNodesInitialized) {
      setLoading(true)
      const updatedNodes = nodes.map((node) => ({
        ...node,
        hidden: hiddenNodeIds.includes(node.id),
      }))

      const { nodes: highlightedNodes, edges: highlightedEdges } =
        highlightNodesAndEdges(updatedNodes, getEdges(), {
          activeTableName,
        })
      const { nodes: layoutedNodes, edges: layoutedEdges } = await handleLayout(
        highlightedNodes,
        highlightedEdges,
      )
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)

      const fitViewOptions = shouldFitViewToActiveTable
        ? { duration: 300 }
        : undefined
      fitView(fitViewOptions)

      setInitializeComplete(true)
      setLoading(false)
    }
  }, [
    nodes,
    getEdges,
    setNodes,
    setEdges,
    handleLayout,
    setLoading,
    setInitializeComplete,
    fitView,
    initializeComplete,
    tableNodesInitialized,
    shouldFitViewToActiveTable,
  ])

  useEffect(() => {
    initialize()
  }, [initialize])
}
