const onMouseDown = function(e) {
    e.stopPropagation();
    e.preventDefault();

    this.dragOriginX = e.pageX;
    this.dragOriginY = e.pageY;
    this.previousX = e.pageX;
    this.previousY = e.pageY;
    this.callback = onMouseMove.bind(this);
    document.addEventListener('mousemove', this.callback, {capture : true});
    document.addEventListener('mouseup', onMouseUp.bind(this), {capture : true, once : true});
}

const onMouseMove = function(e) {
    e.stopPropagation();
    e.preventDefault();

    var dragEvent = new CustomEvent('draggable-drag', {bubbles : true});
    dragEvent.deltaX = e.pageX - this.dragOriginX;
    dragEvent.deltaY = e.pageY - this.dragOriginY;
    dragEvent.moveX = e.pageX - this.previousX;
    dragEvent.moveY = e.pageY - this.previousY;
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