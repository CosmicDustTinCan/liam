import { useCustomReactflow } from '@/features/reactflow/hooks'
import { useUserEditingStore } from '@/stores'
import { useEffect } from 'react'

export const useFitViewWhenActiveTableChange = (enabled: boolean) => {
  const {
    active: { tableName },
  } = useUserEditingStore()
  const { fitView } = useCustomReactflow()

  useEffect(() => {
    if (!enabled || !tableName) return

    fitView({
      maxZoom: 1,
      duration: 300,
      nodes: [{ id: tableName }],
    })
  }, [enabled, tableName, fitView])
}
