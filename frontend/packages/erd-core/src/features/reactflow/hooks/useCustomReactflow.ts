import { type FitViewOptions, useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'
import { MAX_ZOOM, MIN_ZOOM } from '../constants'

export const useCustomReactflow = () => {
  const { fitView: primitiveFitView } = useReactFlow()

  const fitView = useCallback(
    (options?: FitViewOptions) => {
      // NOTE: Added setTimeout() to reference the updated nodes after setNodes() updates the value.
      setTimeout(() => {
        primitiveFitView({
          minZoom: MIN_ZOOM,
          maxZoom: MAX_ZOOM,
          ...options,
        })
      }, 50)
    },
    [primitiveFitView],
  )

  return {
    fitView,
  }
}
