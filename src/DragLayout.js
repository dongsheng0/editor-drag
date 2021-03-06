import React, { PureComponent } from 'react';
import { Layout,Button } from 'antd';
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import ReactEcharts from 'echarts-for-react';
import { getBarChart,getLineChart,getPieChart } from "./chart";
import ModalUeditor from './ModalUEditor/index'
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const { Header, Content} = Layout;

export default class DragLayout extends PureComponent {
  static defaultProps = {
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
  };

  constructor(props) {
    super(props);

    this.state = {
      layouts: this.getFromLS("layouts") || {},
      widgets:[],
      showModalUEditor: false,
      modalUEditorComtent: "内容",
    }
  }



  getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
      } catch (e) {
        /*Ignore*/
      }
    }
    return ls[key];
  }

  saveToLS(key, value) {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-8",
        JSON.stringify({
          [key]: value
        })
      );
    }
  }
  generateDOM = () => {
    return _.map(this.state.widgets, (l, i) => {
      let option;
      if (l.type === 'bar') {
        option = getBarChart();
      }else if (l.type === 'line') {
        option = getLineChart();
      }else if (l.type === 'pie') {
        option = getPieChart();
      }
      let component = (
        <ReactEcharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{width: '100%',height:'100%'}}
        />
      )


      if(l.type === 'text') {
        return (
          <div key={l.i} data-grid={l}>
            <span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span>
             <span onDoubleClick={() =>
              this.setState({ showModalUEditor: true })
             }    dangerouslySetInnerHTML={{ __html: this.state.modalUEditorComtent }}></span>
            {this.state.showModalUEditor && (
              <ModalUeditor
                text={this.props.modalUEditorComtent}
                onClose={() => this.setState({ showModalUEditor: false })}
                onSave={(h) => {
                  this.setState({ modalUEditorComtent: h, showModalUEditor: false })
                }}
              />
            )}
          </div>
        );
      }  else {
        return (
          <div key={l.i} data-grid={l}>
            <span className='remove' onClick={this.onRemoveItem.bind(this, i)}>x</span>
            {component}
          </div>
        );
      }
    });
  };

  addChart(type) {
    const addItem = {
      x: 0,
      // x: (this.state.widgets.length * 3) % (this.state.cols || 12),
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      i: new Date().getTime().toString(),
    };
    this.setState(
      {
        widgets: this.state.widgets.concat({
          ...addItem,
          type,
        }),
      },
    );
  };
  addChart2() {
    const addItem = {
      // x: (this.state.widgets.length * 3) % (this.state.cols || 12),
      x: 0,
      y: Infinity, // puts it at the bottom
      w: 3,
      h: 2,
      i: new Date().getTime().toString(),
    };
    this.setState(
      {
        widgets: this.state.widgets.concat({
          ...addItem,
          type: 'text',
        }),
      },
    );
  };

  onRemoveItem(i) {
    console.log(this.state.widgets)
    this.setState({
      widgets: this.state.widgets.filter((item,index) => index !=i)
    });

  }

  onLayoutChange(layout, layouts) {
    // 为了实现每个组件只占一行，手动把个组件的x固定是0 ，它就是一直是占一行
    Object.keys(layouts).forEach(item => {
      layouts[item].forEach(i => {
        i.x = 0 
      })
    })
    this.setState({ layouts });
  }

  render() {
   return(
     <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%','padding': '0 30px' }}>
        <Button type="primary" style={{'marginRight':'7px'}} onClick={this.addChart.bind(this,'bar')}>添加柱状图</Button>
        <Button type="primary" style={{'marginRight':'7px'}} onClick={this.addChart.bind(this,'line')}>添加折线图</Button>
        <Button type="primary" style={{'marginRight':'7px'}} onClick={this.addChart.bind(this,'pie')}>添加饼图</Button>
        <Button type="primary" style={{'marginRight':'7px'}} onClick={this.addChart2.bind(this)}>添加富文本</Button>
      </Header>
      <Content style={{ marginTop: 44 }}>
        <div style={{ background: '#fff', padding: 20, minHeight: 800 }}>
          <ResponsiveReactGridLayout
            className="layout"
            {...this.props}
            layouts={this.state.layouts}
            onLayoutChange={(layout, layouts) =>
              this.onLayoutChange(layout, layouts)
            }
          >
            {this.generateDOM()}
          </ResponsiveReactGridLayout>
        </div>
      </Content>
    </Layout>
   )}
}
