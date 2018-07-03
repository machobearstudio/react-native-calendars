import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar.main';

export default function getStyle(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: appStyle.calendarBackground
    },

    monthView: {
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      marginTop: 7,
      marginBottom: 7,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    dayContainer: {
      width: 32
    },
    yearView: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      marginTop: 10
    },
    year: {
      marginTop: 7,
      marginBottom: 7,
      flexBasis: '14%',
      alignSelf: 'center',
      alignItems: 'center',
      height: 32
    },
    text: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
      fontSize: 16,
      fontFamily: 'System' ,
      fontWeight: '300',
      color: '#43515c'
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}

