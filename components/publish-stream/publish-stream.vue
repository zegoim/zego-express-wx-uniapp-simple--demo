<template>
    <view class="publish-stream-content">
        <view>推流</view>
        <live-pusher class="testpusher" v-if="livePusherUrl" :url="livePusherUrl" aspect="3:4"
            @statechange="onPushStateChange" mode="SD" min-bitrate="800" max-bitrate="1500"
            @netstatus="onPushNetStateChange" waiting-image="https://storage.zego.im/downloads/pause_publish.png">
        </live-pusher>
        <view>
            <button @tap="openRoom">加入房间并推流</button>
        </view>
    </view>
</template>

<script>
import { ZegoExpressEngine } from "zego-express-engine-miniprogram"; // 以npm的方式引用
import { getLoginToken } from '../../api'
let { appID, server } = getApp().globalData
export default {
    props: {
        roomID: {
            type: String
        },
        pushStreamID: {
            type: String
        }
    },
    data() {
        return {
            livePusherUrl: '',
            userID: 'user_' + Math.random(10).toString(16) + Date.now()
        };
    },
    created() {
        // 创建引擎实例
        this._zg = new ZegoExpressEngine(appID, server) // 不做数据监听，也不必要数据监听，由于数据new ZegoExpressEngine(appID, server) 示例对象过于复杂，监听会报错
        // 初始化小程序组件实例
        this._zg.initContext({ wxContext: this })
        // 在 SDK 的回调 roomStreamUpdate 中获取拉流 streamID
        // 当用户加入或离开房间时，该事件被触发
        const _this = this
        this._zg.on("roomStreamUpdate", (roomID, updateType, streamList) => {
            console.log("roomStreamUpdate", roomID, updateType, streamList);
        });
        // 用户状态更新回调
        this._zg.on('roomUserUpdate', (roomID, updateType, userList) => {
            console.warn(
                `roomUserUpdate: room ${roomID}, user ${updateType === 'ADD' ? 'added' : 'left'} `,
                JSON.stringify(userList),
            );
        });
    },
    methods: {
        async openRoom() {
            if (!this.roomID.trim()) {
                uni.showModal({
                    title: '提示',
                    content: '请输入房间号',
                    showCancel: false,
                });
                return;
            }
            console.log(appID, this.userID)
            const token = await getLoginToken(appID, this.userID);
            await this._zg.loginRoom(this.roomID, token, {
                userID: this.userID, // userID，需用户自己定义，保证全局唯一，建议设置为业务系统中的用户唯一标识
                userName: this.userID // userName 用户名
            }, {
                userUpdate: true // 是否接收用户进出房间的回调，设置为 true 才能接收到房间内其他用户进出房间的回调
            })
            const { url } = await this._zg.startPublishingStream(this.pushStreamID)
            this.livePusherUrl = url
        },
        // live-pusher 绑定推流事件，透传推流事件给 SDK
        onPushStateChange(e) {
            console.error('onPushStateChange', e.detail.code, e.detail.message);
            if (e.detail.code === 5000) {
                this.handupStop = true
                // this.livePusher && (this.livePusher! as wx.LivePusherContext).stop();
            }
            this._zg.updatePlayerState(this.pushStreamID, e);
        },
        // live-pusher 绑定网络状态事件，透传网络状态事件给 SDK
        onPushNetStateChange(e) {
            this._zg.updatePlayerNetStatus(this.pushStreamID, e);
        },

    }
};
</script>

<style scoped lang="scss">
</style>
