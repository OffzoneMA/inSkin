import { useEffect } from 'react'
import { updateCurrentScreen } from '../redux/slices/app/appSlice'
import { useAppDispatch } from '../redux/store'

const useScreenTracking = (navigation, screenName) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const onFocus = () => {
      dispatch(updateCurrentScreen(screenName))
    }

    const onBlur = () => {
      dispatch(updateCurrentScreen(''))
    }

    const onFocusSubscription = navigation.addListener('focus', onFocus)
    const onBlurSubscription = navigation.addListener('blur', onBlur)

    return () => {
      onFocusSubscription
      onBlurSubscription
    }
  }, [dispatch, navigation, screenName])
}

export default useScreenTracking
