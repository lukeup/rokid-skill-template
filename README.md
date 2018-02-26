# rokid-skill-template
# 用于快速创建媒体流歌单技能的模板
## 支持情况
> 指令（可在media_NLP.json内自行扩充)
> - 开始播放、
> - 下一首、下一曲、下一个、切歌
> - 上一首、上一曲、上一个
> - 暂停、暂停播放、暂停一下、
> - 继续、继续播放

> 服务脚本编辑（开发者只需改动以下参数即可生成歌单技能，其中播放模式暂时仅支持在脚本中做修改不支持语音交互）
> - 播放模式，0：顺序播放，1：随机播放。var play_mode = 0;
> - 播放音频的初始索引。var play_count = 0;
> - tts欢迎词。var WELCOME_TTS = '欢迎来到通用媒体模板';
> - 播放列表，顺序播放会按照列表顺序播放。var play_list = [];


# rokid-skill-template
# 用于快速创建文字技能的模板
## 支持情况
> 指令（可在tts_NLP.json内自行扩充)
> - 开始播放、
> - 下一首、下一曲、下一个、切歌
> - 上一首、上一曲、上一个
> - 暂停、暂停播放、暂停一下、
> - 继续、继续播放

> 服务脚本编辑（开发者只需改动以下参数即可生成文字播放技能，其中播放模式暂时仅支持在脚本中做修改不支持语音交互）
> - 播放模式，0：顺序播放，1：随机播放。var play_mode = 0;
> - 播放音频的初始索引。var play_count = 0;
> - tts欢迎词。var WELCOME_TTS = '欢迎来到通用文字模板';
> - 播放列表，顺序播放会按照列表顺序播放。var play_list = [];

