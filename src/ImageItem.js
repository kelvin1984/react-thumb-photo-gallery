import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { combineUrlPath } from './util'
import './index.css'

export default class ImageItem extends Component {
    constructor(props) {
        super(props)
        this.imageHandler = new Image()
        this.imageHandler.addEventListener('load', this.onImageLoad)
        this.imageHandler.addEventListener('error', this.onImageError)
        this.state = { image: null }
    }

    componentDidMount() {
        const { srcPrefix, src } = this.props
        this.imageHandler.src = combineUrlPath(srcPrefix, src)
    }

    componentWillUnmount() {
        this.imageHandler.removeEventListener('load', this.onImageLoad)
        this.imageHandler.removeEventListener('error', this.onImageError)
        this.imageHandler = null
    }

    onImageLoad = e => {
        const { src, onLoad } = this.props
        const height = e.target.naturalHeight
        const width = e.target.naturalWidth

        this.setState({ image: this.props.src })
        typeof onLoad === 'function' && onLoad(src, width, height)
    }

    onImageError = e => {
        
    }

    handleClick = () => {
        const { src, onClick } = this.props
        if (this.state.image && typeof onClick === 'function') {
            onClick(src)
        }
    }

    render() {
        const {
            className,
            src,
            size,
            width,
            height,
            style,
            srcPrefix,
            onClick,
            imagePlaceholder,
            radius,
            getItemRef,
        } = this.props
        const { image } = this.state

        const customStyle = {
            width: width || size,
            height: height || width || size,
            borderRadius: radius,
            ...style,
        }

        if (!image) {
            if (imagePlaceholder) {
                customStyle.backgroundImage = `url(${imagePlaceholder})`
            }
        } else {
            customStyle.backgroundImage = `url(${combineUrlPath(srcPrefix, src)})`
        }

        return (
            <div
                ref={getItemRef}
                className={classNames(className, 'rpg-image-item-wrapper', {
                    'image-item-clickable': !!onClick,
                })}
                style={customStyle}
                onClick={this.handleClick}
            />
        )
    }
}

ImageItem.propTypes = {
    /**
     * 图片资源
     */
    src: PropTypes.string,
    /**
     * 图片资源地址前缀，常见于OSS
     */
    srcPrefix: PropTypes.string,
    /**
     * 图片加载完成的触发事件： (src, width, height) => void
     */
    onLoad: PropTypes.func,
    /**
     * 点击图片时触发事件： (src) => void
     */
    onClick: PropTypes.func,
}
ImageItem.defaultProps = {
    src: undefined,
    srcPrefix: undefined,
    onLoad: undefined,
    onClick: undefined,
}
