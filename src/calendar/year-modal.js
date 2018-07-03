import { Modal, View, Text, TouchableWithoutFeedback } from 'react-native'

const YearModal = props => 
  <Modal style={{zIndex: 9999}} visible={props.visible} close={props.close}>
    <TouchableWithoutFeedback onPress={props.close}>
      <View style={{backgroundColor: 'red', width: 200, height: 300}}>
        <Text>hi</Text>
      </View>
    </TouchableWithoutFeedback>
  </Modal>

export default YearModal