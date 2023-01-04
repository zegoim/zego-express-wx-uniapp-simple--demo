<template>
    <view>
        <view>其他用户进入房间拉流</view>
        <live-player v-for="item in livePlayerList" :key="item.streamID" :id="item.streamID" :src="item.url" mode="RTC"
            autoplay :enable-metadata="true" @statechange="onPlayStateChange" @netstatus="onPlayNetStateChange">
        </live-player>
        <view>
            <button @tap="openRoom">加入房间拉流</button>
        </view>
    </view>
</template>

<script>
import { ZegoExpressEngine } from "zego-express-engine-miniprogram"; // 以npm的方式引用
let { appID, server, userID } = getApp().globalData
// 又推又拉，登录房间需要跟推流userID 和 token不一致
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
            livePlayerList: [],
            userID: userID
        };
    },
    computed: {

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
    watch: {

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
            const token = getApp().globalData.token;
            debugger
            await this._zg.loginRoom(this.roomID, token, {
                userID: this.userID, // userID，需用户自己定义，保证全局唯一，建议设置为业务系统中的用户唯一标识
                userName: this.userID // userName 用户名
            }, {
                userUpdate: true // 是否接收用户进出房间的回调，设置为 true 才能接收到房间内其他用户进出房间的回调
            })
            const result = await this._zg.startPlayingStream(this.pushStreamID)
            this.livePlayerList.push(result)
            // this.livePusherUrl = url
        },
        // live-player 绑定网络状态事件，透传网络状态事件给 SDK
        onPlayNetStateChange(e) {
            this._zg.updatePlayerNetStatus(e.currentTarget.id, e);
        },
        //live-player 绑定拉流事件，透传拉流事件给 SDK
        onPlayStateChange(e) {
            this._zg.updatePlayerState(e.currentTarget.id, e);
        },
    }
};
</script>

<style scoped lang="scss">
</style>
