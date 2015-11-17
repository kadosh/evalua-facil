(function () {

    module.exports.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    module.exports.generate = function (len) {
        var buf = []
            , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            , charlen = chars.length;

        for (var i = 0; i < len; ++i) {
            buf.push(chars[random(0, charlen - 1)]);
        }

        return buf.join('');
    };
})();