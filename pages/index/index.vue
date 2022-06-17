<template>
	<view class="content">
		<input v-model="roomID" type="text" placeholder="请输入房间号" />
		<publish-stream-vue :roomID="roomID" :pushStreamID="pushStreamID"></publish-stream-vue>
		<play-stream-vue :roomID="roomID" :pushStreamID="pushStreamID"></play-stream-vue>
		<button v-if="canShow == 0" open-type="openSetting" @opensetting="settingCallback">
			授权使用摄像头和麦克风
		</button>
	</view>
</template>

<script>
import publishStreamVue from '../../components/publish-stream/publish-stream.vue'
import playStreamVue from '../../components/play-stream/play-stream.vue'
export default {
	components: {
		publishStreamVue,
		playStreamVue
	},
	data() {
		return {
			roomID: '',
			canShow: 1,
			pushStreamID: 'push_stream_' + Math.random(10).toString(16) + Date.now(),
		}
	},
	onLoad() {
		uni.authorize({
			scope: "scope.camera",
			success() {
			},
			fail() {
				this.canShow = 0
			},
		});

		uni.authorize({
			scope: "scope.record",
			success() {
			},
			fail() {
				this.canShow = 0
			},
		});
	},
	methods: {

	}
}
</script>

<style>
</style>
