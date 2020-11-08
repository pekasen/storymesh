import { FunctionalComponent, h } from 'preact';

interface IDragReceiver {
    onDrop: (e: DragEvent) => void
}

export const DragReceiver: FunctionalComponent<IDragReceiver> = ({ children, onDrop }) => {
    const _children = children as h.JSX.Element;
    _children.props['onDragOver'] = (e: DragEvent) => {
        e.preventDefault();
    }
    _children.props['onDrop'] = onDrop;
    _children.props['style'] = "background: red; min-height:400px"

    return _children
};
