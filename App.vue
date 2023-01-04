<script>
export default {
	globalData: {
		server: "",
		token: "",
		userID: "",
		appID: 1234
	},
	onLaunch: function () {
		console.log('App Launch')
	},
	onShow: function () {
		const _globalData = uni.getStorageSync('globalData')
		if(_globalData instanceof Object) {
			// const {appID, server, token, userID} =_globalData
			// this.globalData.appID = appID
			// this.globalData.server = server
			// this.globalData.token = token
			// this.globalData.userID = userID
		}
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
/*每个页面公共css */
</style>
