exports.handler = function (event, context, callback) {
    var rokid = Rokid.handler(event, context, callback);
    rokid.registerHandlers(handlers);
    rokid.execute();
};

/**====================================================================================用户须编辑区域==============================================================================*/

//播放模式，0：顺序播放，1：随机播放。
var play_mode = 0;
//播放音频的索引。
var play_count = 0;
//tts欢迎词
var WELCOME_TTS = '欢迎来到通用媒体模板';
//播放列表，顺序播放会按照列表顺序播放。
var play_list = [
    'https://rokidstorycdn.rokid.com/story/track/2000001481/b53b954a-773d-11e7-bff5-00163e0e8605.mp3',
    'https://rokidstorycdn.rokid.com/story/track/2000001478/30067372-771a-11e7-bff5-00163e0e8605.mp3',
    'https://rokidstorycdn.rokid.com/story/track/2000001475/8ca91194-76ba-11e7-bff5-00163e0e8605.mp3'
];

/**====================================================================================用户须编辑区域==============================================================================*/

const dbGet = Rokid.promisify(Rokid.dbServer.get);
const dbSet = Rokid.promisify(Rokid.dbServer.set);

var userId = Rokid.param.context.user.userId || 'test_user_id';
var handlers = {
    'ROKID.INTENT.WELCOME': function () {
        try {
            this.setTts({ tts: WELCOME_TTS, itemId: 'welcome' });
            this.emit(':done');
        } catch (e) {
            this.emit(':error', e);
        }
    },
    /**
     * 开始播放，切换下一首
     */
    'play': function () {
        //查询播放模式
        dbGet(userId + '_mode').then(mode => {
            console.log('mode:' + mode);
            if (mode !== '未查询到相关数据') {
                //查询到有播放模式
                play_mode = mode;
            }
            return mode;
        }).then(mode => {
            dbGet(userId + '_count').then(count => {
                console.log('count:' + count);
                let media_url = '';
                if (count !== '未查询到相关数据') {
                    //查询到有播放记录
                    play_count = count;
                    if (play_count > play_list.length - 1) {
                        play_count = 0;
                    }
                }
                media_url = play_list[play_count];
                if (mode == 1) {
                    //随机播放
                    play_count = Math.floor(Math.random() * play_list.length);
                    media_url = play_list[play_count];
                }
                return media_url;
            }).then(media_url => {
                console.log('media:' + media_url);
                dbSet(userId + '_count', play_count + 1).then(res => {
                    //异步存储不管失败与否
                });
                this.setMedia({ type: 'AUDIO', url: media_url });
                this.emit(':done');
            }).catch(e => {
                this.emit(':error', e);
            })
        }).catch(e => {
            this.emit(':error', e);
        })
    },
    /**
     * 上一首
     */
    'pre': function () {
        dbGet(userId + '_count').then(count => {
            console.log('count:' + count);
            let media_url = '';
            if (count !== '未查询到相关数据') {
                //查询到有播放记录
                play_count = count - 2;
                if (play_count > play_list.length - 1) {
                    play_count = 0;
                } else if (play_count < 0) {
                    play_count = play_list.length - 1;
                }
            }
            media_url = play_list[play_count];
            return media_url;
        }).then(media_url => {
            console.log('media:' + media_url);
            dbSet(userId + '_count', play_count + 1).then(res => {
                //异步存储不管失败与否
            });
            this.setMedia({ type: 'AUDIO', url: media_url });
            this.emit(':done');
        }).catch(e => {
            this.emit(':error', e);
        })
    },
    /**
     * 暂停播放
     */
    'pause': function() {
        this.setMedia({action: 'PAUSE', url: 'xxx'});
        this.emit(':done');
    },
    /**
     * 继续播放
     */
    'resume': function() {
        this.setMedia({action: 'RESUME', url: 'xxx'});
        this.emit(':done');
    },
    /**
     * 循环播放
     */
    'Media.FINISHED': function () {
        this.emit('play');
    },
    /**
     * 为第一个tts接上media
     */
    'Voice.FINISHED': function () {
        if (Rokid.param.request.content.extra.voice.itemId === 'welcome') {
            this.emit('play');
        } else {
            this.emit(':done');
        }
    },
    'ROKID.INTENT.EXIT': function () {
        try {
            console.log('技能退出成功');
            this.emit(':done');
        } catch (e) {
            this.emit(':error', e);
        }
    }
};