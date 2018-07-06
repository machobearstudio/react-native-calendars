import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.calendar.header';

export default function(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      alignItems: 'center'
    },
    monthText: {
      fontSize: appStyle.textMonthFontSize,
      fontFamily: appStyle.textMonthFontFamily,
      fontWeight: appStyle.textMonthFontWeight,
      color: '#494949',
      margin: 10
    },
    arrow: {
      padding: 10
    },
    
    leftArrow: {
      transform: [{rotate: '90deg'}]
    },

    rightArrow: {
      transform: [{rotate: '-90deg'}]
    },
    
    week: {
      marginTop: 7,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },

    dayHeader: {
      marginTop: 2,
      marginBottom: 7,
      width: 32,
      textAlign: 'center',
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      color: appStyle.textSectionTitleColor
    },
    titleView: {
      paddingHorizontal: 25,
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center'
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}
