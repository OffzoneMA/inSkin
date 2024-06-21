import { StyleSheet } from 'react-native'
import { colors } from '../../../constants'

export const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonContainer: {
    marginRight: 20,
  },
  plusImage: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
  plusImageContainer: {
    width: 33,
    height: 33,
  },
  clearFilter: {
    marginLeft: 10,
  },
  clearFilterIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  removeFilterContainerMain: {
    marginRight: 15,
  },
  removeFilterContainer: {
    flexDirection: 'row',
    minWidth: 110,
  },
  divider: {
    height: 1,
    marginTop: 3,
    width: '100%',
    backgroundColor: colors.lightBlack,
  },
})
