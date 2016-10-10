module.exports = {
    id : 'noop',
    name: 'None',
    createInstrument : function() { 
        return { 
            play : function() {},
            dispose : function() {}
        };
    },
    createView : function() {
        return '<div></div>';
    }
}