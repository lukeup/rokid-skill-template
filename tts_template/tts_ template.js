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
var WELCOME_TTS = '欢迎来到通用文字模板';
//播放列表，顺序播放会按照列表顺序播放。
var play_list = [
    '话一',
    '话二',
    '话三'
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
        dbGet(userId + '_tts_mode').then(mode => {
            console.log('mode:' + mode);
            if (mode !== '未查询到相关数据') {
                //查询到有播放模式
                play_mode = mode;
            }
            return mode;
        }).then(mode => {
            dbGet(userId + '_tts_count').then(count => {
                console.log('count:' + count);
                let tts_content = '';
                if (count !== '未查询到相关数据') {
                    //查询到有播放记录
                    play_count = count;
                    if (play_count > play_list.length - 1) {
                        play_count = 0;
                    }
                }
                tts_content = play_list[play_count];
                if (mode == 1) {
                    //随机播放
                    play_count = Math.floor(Math.random() * play_list.length);
                    tts_content = play_list[play_count];
                }
                return tts_content;
            }).then(tts_content => {
                console.log('tts:' + tts_content);
                dbSet(userId + '_tts_count', play_count + 1).then(res => {
                    //异步存储不管失败与否
                });
                this.setTts({ tts: tts_content });
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
        dbGet(userId + '_tts_count').then(count => {
            console.log('count:' + count);
            let tts_content = '';
            if (count !== '未查询到相关数据') {
                //查询到有播放记录
                play_count = count - 2;
                if (play_count > play_list.length - 1) {
                    play_count = 0;
                } else if (play_count < 0) {
                    play_count = play_list.length - 1;
                }
            }
            tts_content = play_list[play_count];
            return tts_content;
        }).then(tts_content => {
            console.log('tts:' + tts_content);
            dbSet(userId + '_tts_count', play_count + 1).then(res => {
                //异步存储不管失败与否
            });
            this.setTts({ tts: tts_content });
            this.emit(':done');
        }).catch(e => {
            this.emit(':error', e);
        })
    },
    /**
     * 暂停播放
     */
    'pause': function () {
        this.setTts({ action: 'STOP', tts: 'xxx' });
        this.emit(':done');
    },
    /**
     * 继续播放
     */
    'resume': function () {
        this.emit('play');
    },
    /**
     * 循环播放
     */
    'Voice.FINISHED': function () {
        this.emit('play');
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