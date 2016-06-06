(function (app) {
    app.filter('default', function () {
        return function (value, defaultValue) {
            if (!value || value === "") {
                return defaultValue;
            }
            return value;
        };
    });

    app.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) {
                return '';
            }
            max = parseInt(max, 10);
            if (!max) {
                return value;
            }
            if (value.length <= max) {
                return value;
            }
            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || ' …');
        };
    });

    app.filter('twitterBigger', function () {
        return function (url) {
            return url.replace("_normal", "_bigger");
        };
    });

    app.filter('twitterFull', function () {
        return function (url) {
            return url.replace("_normal", "").replace("_bigger", "");
        };
    });

    app.filter('cleanHostName', function () {
        return function (source) {
            source = source.replace(/^https?:\/\//, '');
            if (source.substr(-1) == '/') {
                source = source.substr(0, source.length - 1);
            }
            return (source);
        };
    });

    app.filter('timeSince', function (iso8601) {

        return function (date) {
            if (typeof date !== 'object') {
                if (typeof date == 'string') {
                    date = iso8601.parse(date);
                } else {
                    date = new Date(date);
                }
            }

            var seconds = Math.floor((new Date() - date) / 1000);
            var intervalType;

            var interval = Math.floor(seconds / 31536000);
            if (interval >= 1) {
                intervalType = 'year';
            } else {
                interval = Math.floor(seconds / 2592000);
                if (interval >= 1) {
                    intervalType = 'month';
                } else {
                    interval = Math.floor(seconds / 86400);
                    if (interval >= 1) {
                        intervalType = 'day';
                    } else {
                        interval = Math.floor(seconds / 3600);
                        if (interval >= 1) {
                            intervalType = "hour";
                        } else {
                            interval = Math.floor(seconds / 60);
                            if (interval >= 1) {
                                intervalType = "minute";
                            } else {
                                interval = seconds;
                                intervalType = "second";
                            }
                        }
                    }
                }
            }

            if (interval > 1 || interval === 0) {
                intervalType += 's';
            }

            return interval + ' ' + intervalType;
        };
    });

    app.filter('nl2br', function ($sce) {
        return function (msg, is_xhtml) {
            is_xhtml = is_xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            return $sce.trustAsHtml(msg);
        };
    });

    app.filter('numberFormat', function () {
        return function (number) {
            if (number > 0) {
                var abs = Math.abs(number);
                if (abs >= Math.pow(10, 12)) {
                    number = (number / Math.pow(10, 12)).toFixed(1) + "t";
                }
                else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
                    number = (number / Math.pow(10, 9)).toFixed(1) + "b";
                }
                else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
                    number = (number / Math.pow(10, 6)).toFixed(1) + "m";
                }
                else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
                    number = (number / Math.pow(10, 3)).toFixed(1) + "k";
                }
            }
            return number;
        };
    });
    
    app.filter('to_trusted_html', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);

    app.filter('getYoutubeId', function () {
        return function(youtubeLink) {
            if (youtubeLink.match(/(youtube.com)/)) {
                var getYouTubeVideoID = youtubeLink.split("v=")[1];
                var cleanVideoID = getYouTubeVideoID.replace(/(&)+(.*)/, ""); // This is YouTube video ID.
                return cleanVideoID;
            }
            return "";
        };
    });

}(angular.module("angularHorizonsPublicView.filters")));