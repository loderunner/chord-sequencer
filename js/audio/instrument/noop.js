module.exports = {
    id : 'noop',
    name: 'None',
    params : [],
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