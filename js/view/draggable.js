const DraggableEvent = function(type, e, target) {
    var dragEvent = new CustomEvent(type, {bubbles : true});

    dragEvent.originX = target.dragOriginX;
    dragEvent.originY = target.dragOriginY;
    dragEvent.pageX = e.pageX;
    dragEvent.pageY = e.pageY;
    dragEvent.deltaX = e.pageX - target.dragOriginX;
    dragEvent.deltaY = e.pageY - target.dragOriginY;
    dragEvent.moveX = e.pageX - target.previousX;
    dragEvent.moveY = e.pageY - target.previousY;

    return dragEvent;
}

const onClick = function(e) {
    e.stopPropagation();
    document.removeEventListener('click', onClick, {capture : true});        
};

const onMouseDown = function(e) {
    e.stopPropagation();
    e.preventDefault();

    this.dragOriginX = e.pageX;
    this.dragOriginY = e.pageY;
    this.previousX = e.pageX;
    this.previousY = e.pageY;
    this.callback = onMouseMove.bind(this);
    document.addEventListener('mousemove', this.callback, {capture : true});

    const self = this;
    const doMouseUp = function(e) {
        onMouseUp.call(self, e);
        document.removeEventListener('mouseup', doMouseUp, {capture : true});
    };

    document.addEventListener('mouseup', doMouseUp, {capture : true});
    document.addEventListener('click', onClick, {capture : true});
}

const onMouseMove = function(e) {
    e.stopPropagation();
    e.preventDefault();

    var dragEvent = DraggableEvent('draggable-drag', e, this);
    this.dispatchEvent(dragEvent);

    this.previousX = e.pageX;
    this.previousY = e.pageY;
}

const onMouseUp = function(e) {
    e.stopPropagation();
    e.preventDefault();

    this.dragOriginX = 0;
    this.dragOriginY = 0;
    document.removeEventListener('mousemove', this.callback, {capture : true});
}

module.exports = function(target) {
    target.classList.add('draggable');
    target.addEventListener('mousedown', onMouseDown.bind(target));
}