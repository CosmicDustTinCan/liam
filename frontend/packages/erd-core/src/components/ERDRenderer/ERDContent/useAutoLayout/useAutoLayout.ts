import { useNodesContext } from '@/providers'
import { useReactFlow } from '@xyflow/react'
import type { Edge, FitViewOptions, Node } from '@xyflow/react'
import { useCallback } from 'react'
import { useERDContentContext } from '../ERDContentContext'
import { getElkLayout } from './getElkLayout'

export const useAutoLayout = () => {
  const { setNodes } = useNodesContext()
  const { fitView } = useReactFlow()
  const {
    actions: { setLoading, setInitializeComplete },
  } = useERDContentContext()

  const handleLayout = useCallback(
    async (
      nodes: Node[],
      edges: Edge[],
      fitViewOptions: FitViewOptions = {},
    ) => {
      setLoading(true)
      const hiddenNodes: Node[] = []
      const visibleNodes: Node[] = []
      for (const node of nodes) {
        if (node.hidden) {
          hiddenNodes.push(node)
        } else {
          visibleNodes.push(node)
        }
      }

      // NOTE: Only include edges where both the source and target are in the nodes
      const nodeMap = new Map(visibleNodes.map((node) => [node.id, node]))
      const visibleEdges = edges.filter((edge) => {
        return nodeMap.get(edge.source) && nodeMap.get(edge.target)
      })

      const newNodes = await getElkLayout({
        nodes: visibleNodes,
        edges: visibleEdges,
      })

      setNodes({
        type: 'UPDATE_SIZE_AND_POSITION',
        payload: [...hiddenNodes, ...newNodes],
      })

      setTimeout(() => {
        fitView(fitViewOptions)
        setLoading(false)
        setInitializeComplete(true)
      }, 1)
    },
    [setNodes, setLoading, setInitializeComplete, fitView],
  )

  return { handleLayout }
}
