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
    if (this.moved) {
        e.stopPropagation();
        e.preventDefault();
    }

    document.removeEventListener('click', onClick, {capture : true});        

    delete this.moved;
};

const onMouseDown = function(e) {
    e.stopPropagation();
    e.preventDefault();

    this.moved = false;
    this.dragOriginX = e.pageX;
    this.dragOriginY = e.pageY;
    this.previousX = e.pageX;
    this.previousY = e.pageY;
    this.callback = onMouseMove.bind(this);

    document.addEventListener('mousemove', this.callback, {capture : true});

    var dragEvent = DraggableEvent('draggable-begin', e, this);
    this.dispatchEvent(dragEvent);

    const self = this;

    const doMouseUp = function(e) {
        onMouseUp.call(self, e);
        document.removeEventListener('mouseup', doMouseUp, {capture : true});
    };
    const doClick = function(e) {
        onClick.call(self, e);
        document.removeEventListener('click', doClick, {capture : true});
    };

    document.addEventListener('mouseup', doMouseUp, {capture : true});
    document.addEventListener('click', doClick, {capture : true});
}

const onMouseMove = function(e) {
    e.stopPropagation();
    e.preventDefault();

    this.moved = true;

    var dragEvent = DraggableEvent('draggable-drag', e, this);
    this.dispatchEvent(dragEvent);

    this.previousX = e.pageX;
    this.previousY = e.pageY;
}

const onMouseUp = function(e) {
    if (this.moved) {
        e.stopPropagation();
        e.preventDefault();
    }

    var dragEvent = DraggableEvent('draggable-end', e, this);
    this.dispatchEvent(dragEvent);

    document.removeEventListener('mousemove', this.callback, {capture : true});

    delete this.dragOriginX;
    delete this.dragOriginY;
    delete this.previousX;
    delete this.previousY;
    delete this.callback;
}

module.exports = function(target) {
    target.classList.add('draggable');
    target.addEventListener('mousedown', onMouseDown.bind(target));
}