import React, { Component } from 'react';
import { render, findDOMNode, unmountComponentAtNode } from 'react-dom';
import { action } from '../utils/store';

export default class CompanyTag extends Component {
  state = {
    name: '',
    tag: '',
    innerHTML: '',
  }
  wrapContainer() {
    const { name, tag } = this.state;
    const { show=true } = this.props;
    const styles = `
      .icu996 {
        height: 0.93rem;
        line-height: 0.93rem;
        color: red;
        border: 1px solid red;
        border-radius: 3px;
        margin: 0 3px 0 3px;
      }
      .wlb955 {
        height: 0.93rem;
        line-height: 0.93rem;
        color: green;
        border: 1px solid green;
        border-radius: 3px;
        margin: 0 3px 0 3px;
      }
      .name {
        display: inline-block;
        overflow: hidden;
        max-width: calc(100% - 78px);
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .root {
        display: flex;
        align-items: center;
      }`
    return (<span className="root">
      <span className={show && tag ? "name" : "" }>{name}</span>
      {show && tag ? <span className={tag}>{tag === 'icu996' ? '996ICU' : '955WLB'}</span> : null }
      <style type="text/css">{styles}</style>
    </span>)
  }
  componentDidUpdate() {
    render(this.wrapContainer(), this.state.root);
  }
  componentWillUnmount() {
    if (this.state.root) {
      unmountComponentAtNode(this.state.root);
    }
  }
  componentDidMount() {
    const node = findDOMNode(this).parentNode;
    const innerHTML = node.innerHTML;
    this.setState({ innerHTML})
    const name = node.getAttribute('title').replace(/^公司/, '');
    // 猎聘title多了前缀“公司”
    //console.log('name', name, innerHTML, node)
    if (name) {
      const mode = 'open';
      const delegatesFocus = false;
      const root = node.parentNode.attachShadow ? node.parentNode.attachShadow({ mode, delegatesFocus }) : node.parentNode.createShadowRoot();
      render(this.wrapContainer(), root)
      this.setState({ root, name })
      action({ type: 'background/getTagByCompanyName', name}).then(({ err, res, req }) => {
        console.log('getTagByCompanyName', err, res, req)
        if (!err) {
          const { tag } = res;
          this.setState({ tag })
        }
      })
    }
  }
  render() {
    return <span>{this.state.name}</span>
    //return <span dangerouslySetInnerHTML={{__html: this.state.innerHTML}} />
  } 
}


