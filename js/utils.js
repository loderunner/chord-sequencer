module.exports = {
    stopPropagation : function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    }
}