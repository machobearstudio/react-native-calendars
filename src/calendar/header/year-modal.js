import { Modal, View, Text } from 'react-native'

const YearModal = props => 
  <Modal style={{zIndex: 9999}} visible={props.visible} close={props.close}>
    <View style={{backgroundColor: 'red', width: 200, height: 300}}>
      <Text>hi</Text>
    </View>
  </Modal>

export default YearModal