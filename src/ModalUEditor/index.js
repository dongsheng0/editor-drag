import React, {Component} from 'react'
import { Modal } from 'antd'
import EditorDemo from './editor'
export default class ModalUeditor extends Component {
  static defaultProps = {
    content:'',
    onSubmit(){},
    onClose(){},
  }
  state = {text : ''}
  
  render(){
    return (
      <Modal
        title="编辑富文本"
        visible={true}
        width={760}
        keyboard={false}
        maskClosable={false}
        onOk={e => this.props.onSave(this.state.text)}
        onCancel={e => this.props.onClose()}
        className="modal-ueditor"
      >
        <div style={{maxHeight: 500,overflowY:'auto',overflowX:'hidden'}}>
          <EditorDemo onSave={(htmlContent) => this.setState({text: htmlContent})} text={this.props.text} />
        </div>
      </Modal>
    )
  }
}
